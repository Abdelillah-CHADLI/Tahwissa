import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProgressSteps } from "../../components/traveler/booking/ProgressSteps";
import { BookingDetailsForm } from "../../components/traveler/booking/BookingDetailsForm";
import { PaymentForm } from "../../components/traveler/booking/PaymentForm";
import { ConfirmationStep } from "../../components/traveler/booking/ConfirmationStep";
import { BookingSummary } from "../../components/traveler/booking/BookingSummary";
import { BookingSuccessPage } from "../../components/traveler/booking/BookingSuccessPage";
import { bookingService, tourService } from "../../services/api";
import defaultTourImage from "../../assets/imgs/tour1.jpeg";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfPeople: string;
    date: string;
    specialRequests: string;
}

interface Tour {
    id: number;
    title: string;
    location: string;
    duration: string;
    price: number;
    image: string;
}

export function BookingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourId } = useParams<{ tourId: string }>();
    const [step, setStep] = useState<number>(1);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tour, setTour] = useState<Tour | null>(null);
    const [bookingRef, setBookingRef] = useState<string | undefined>(undefined);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        numberOfPeople: "1",
        date: "",
        specialRequests: "",
    });

    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId) {
                setError("No tour ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // First, try to use tour data from location state
                const stateData = location.state?.tourData;
                if (stateData) {
                    setTour({
                        id: Number(stateData.tour_id || stateData.id),
                        title: String(stateData.tour_title || stateData.title),
                        location: String(stateData.location),
                        duration: String(stateData.duration),
                        price: Number(stateData.price),
                        image: String(stateData.images?.[0] || stateData.image || defaultTourImage),
                    });
                    setLoading(false);
                    return;
                }

                // If no state data, fetch from API
                const tourData = await tourService.getTourById(tourId);
                if (tourData) {
                    setTour({
                        id: Number(tourData.tour_id || tourData.id),
                        title: String(tourData.tour_title || tourData.title),
                        location: String(tourData.location),
                        duration: String(tourData.duration),
                        price: Number(tourData.price),
                        image: String(tourData.images?.[0] || tourData.image || defaultTourImage),
                    });
                } else {
                    setError("Tour not found");
                }
            } catch (error) {
                console.error("Failed to fetch tour:", error);
                setError("Failed to load tour details");
            } finally {
                setLoading(false);
            }
        };

        fetchTour();

        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    firstName: user.firstName || user.first_name || "",
                    lastName: user.lastName || user.last_name || "",
                    email: user.email || "",
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, [tourId, location]);

    const getCurrentTravellerId = (): string | null => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return (
                    parsed?.traveller_id ||
                    parsed?.profileId ||
                    parsed?.userId ||
                    parsed?.id ||
                    null
                );
            } catch {
                // ignore
            }
        }

        return (
            localStorage.getItem('traveller_id') ||
            localStorage.getItem('profileId') ||
            localStorage.getItem('userId') ||
            localStorage.getItem('id') ||
            null
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleConfirm = async () => {
        if (!tour || !tourId) return;

        try {
            const travellerId = getCurrentTravellerId();
            if (!travellerId) {
                alert('Missing traveler information. Please sign in again.');
                return;
            }

            const response = await bookingService.createBooking({
                traveller_id: travellerId,
                tour_id: tourId,
            });

            // Check if the booking was successful
            if (response.success) {
                const ref = response.data?.booking_ref || response.data?.reference || response.data?.id;
                if (ref) setBookingRef(String(ref));
                setShowSuccess(true);
            } else {
                alert(`Failed to create booking: ${response.error || 'Please try again'}`);
            }
        } catch (error: any) {
            console.error('Booking failed:', error);
            const errorMessage = error?.response?.data?.error
                || error?.message
                || 'Failed to create booking';
            alert(errorMessage);
        }
    };

    const handleNavigate = (page: string) => {
        switch (page) {
            case 'requests':
                navigate('/traveler/requests');
                break;
            case 'explore':
                navigate('/traveler/explore');
                break;
            case 'details':
                navigate(`/traveler/details/${tourId}`, {
                    state: tour ? { tour } : undefined,
                });
                break;
            default:
                navigate('/traveler');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {error || "Tour not found"}
                </h2>
                <button
                    onClick={() => navigate('/traveler/explore')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    const totalPrice = tour.price * parseInt(formData.numberOfPeople || "1");

    if (showSuccess) {
        return (
            <BookingSuccessPage
                onNavigate={handleNavigate}
                tourTitle={tour?.title}
                email={formData.email}
                bookingRef={bookingRef}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    className="rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-md text-shadow-black font-semibold hover:bg-lime-300 flex items-center mb-4 sm:mb-6 transition-colors"
                    onClick={() => handleNavigate('details')}
                >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 inline-block mr-2" />
                    Back to Explore
                </button>

                <ProgressSteps step={step} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <BookingDetailsForm
                                formData={formData}
                                onChange={handleInputChange}
                                onNext={handleNext}
                            />
                        )}

                        {step === 2 && (
                            <PaymentForm
                                onBack={handleBack}
                                onNext={handleNext}
                            />
                        )}

                        {step === 3 && (
                            <ConfirmationStep
                                formData={formData}
                                onBack={handleBack}
                                onConfirm={handleConfirm}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <BookingSummary
                            tour={tour}
                            formData={formData}
                            totalPrice={totalPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
