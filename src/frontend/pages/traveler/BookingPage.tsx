import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { ProgressSteps } from "../../components/traveler/booking/ProgressSteps";
import { BookingDetailsForm } from "../../components/traveler/booking/BookingDetailsForm";
import { PaymentForm } from "../../components/traveler/booking/PaymentForm";
import { ConfirmationStep } from "../../components/traveler/booking/ConfirmationStep";
import { BookingSummary } from "../../components/traveler/booking/BookingSummary";
import { BookingSuccessPage } from "../../components/traveler/booking/BookingSuccessPage";
import { bookingService } from "../../services/api";

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
    const { id } = useParams<{ id: string }>();
    const [step, setStep] = useState<number>(1);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        numberOfPeople: "1",
        date: "",
        specialRequests: "",
    });

    const tour: Tour = {
        id: parseInt(id || "1"),
        title: "Sahara Desert 5-Day Adventure",
        location: "Tamanrasset, Algeria",
        duration: "5 Days / 4 Nights",
        price: 45000,
        image: "https://images.unsplash.com/photo-1670015239006-610536cc0593",
    };

    // --- Handlers ---
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
        try {
            const travellerId = localStorage.getItem('userId') || 'default-id';

            await bookingService.createBooking({
                traveller_id: travellerId,
                tour_id: tour.id.toString(),
            });

            setShowSuccess(true);
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to create booking');
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
                navigate('/traveler/details');
                break;
            default:
                navigate('/traveler');
        }
    };

    // --- Calculations ---
    const totalPrice = tour.price * parseInt(formData.numberOfPeople || "1");

    // --- Success State ---
    if (showSuccess) {
        return <BookingSuccessPage onNavigate={handleNavigate} />;
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