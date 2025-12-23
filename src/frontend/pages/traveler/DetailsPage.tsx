import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { ArrowLeft, MapPin, Users, Clock, Star, CheckCircle, XCircle, Shield, Calendar, MessageCircle, ShieldCheck, Phone, Mail, Globe, Building2, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { tourService, profileService } from "../../services/api";

interface DaySchedule {
    id: number;
    title: string;
    description: string;
    activities: string[];
    meals?: string;
    accommodation?: string;
}

interface TourInclusions {
    included: string[];
    notIncluded: string[];
    requirements: string[];
}

function DayByDayScheduleTab({ tourDetails }: { tourDetails: string | DaySchedule[] | null }) {
    let schedule: DaySchedule[] = [];

    if (tourDetails) {
        if (typeof tourDetails === 'string') {
            try {
                const parsed = JSON.parse(tourDetails);
                if (Array.isArray(parsed)) {
                    schedule = parsed;
                } else {
                    schedule = [{
                        id: 1,
                        title: 'Tour Overview',
                        description: tourDetails,
                        activities: []
                    }];
                }
            } catch {
                schedule = [{
                    id: 1,
                    title: 'Tour Overview',
                    description: tourDetails,
                    activities: []
                }];
            }
        } else if (Array.isArray(tourDetails)) {
            schedule = tourDetails;
        }
    }

    if (schedule.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No itinerary details available for this tour.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Day-by-Day Itinerary</h2>

            {schedule.map((day, index) => (
                <div key={day.id || index} className="border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-gray-50">
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#4d8b8b] text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg">
                            {day.id || index + 1}
                        </div>

                        <div className="flex-1 min-w-0 space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{day.title || `Day ${index + 1}`}</h3>
                            <p className="text-sm sm:text-base text-gray-600">{day.description}</p>

                            {day.activities && day.activities.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Activities:</h4>
                                    <ul className="space-y-1.5">
                                        {day.activities.map((activity, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                                                <span className="text-[#4d8b8b] mt-1">•</span>
                                                <span>{activity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {day.meals && (
                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="text-xs font-medium text-gray-500 mb-1">Meals Included</p>
                                        <p className="text-sm text-gray-900">{day.meals}</p>
                                    </div>
                                )}
                                {day.accommodation && (
                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <p className="text-xs font-medium text-gray-500 mb-1">Accommodation</p>
                                        <p className="text-sm text-gray-900">{day.accommodation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function WhatsIncludedTab({ tourIncluded }: { tourIncluded: string | TourInclusions | null }) {
    // Parse inclusions - handles JSON or plain text
    let inclusions: TourInclusions = {
        included: [],
        notIncluded: [],
        requirements: []
    };

    if (tourIncluded) {
        if (typeof tourIncluded === 'string') {
            const trimmed = tourIncluded.trim();
            // Try JSON parse first
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        inclusions.included = parsed.map(item => typeof item === 'string' ? item : String(item));
                    } else if (typeof parsed === 'object' && parsed !== null) {
                        inclusions = {
                            included: Array.isArray(parsed.included) ? parsed.included : [],
                            notIncluded: Array.isArray(parsed.notIncluded || parsed.not_included) ? (parsed.notIncluded || parsed.not_included) : [],
                            requirements: Array.isArray(parsed.requirements) ? parsed.requirements : []
                        };
                    }
                } catch {
                    // Plain text - split by common separators
                    inclusions.included = trimmed.split(/[,\n•-]/).map(s => s.trim()).filter(Boolean);
                }
            } else {
                // Plain text - split by common separators
                inclusions.included = trimmed.split(/[,\n•-]/).map(s => s.trim()).filter(Boolean);
            }
        } else if (Array.isArray(tourIncluded)) {
            inclusions.included = tourIncluded.map(item => typeof item === 'string' ? item : String(item));
        } else if (typeof tourIncluded === 'object' && tourIncluded !== null) {
            inclusions = {
                included: Array.isArray((tourIncluded as TourInclusions).included) ? (tourIncluded as TourInclusions).included : [],
                notIncluded: Array.isArray((tourIncluded as TourInclusions).notIncluded) ? (tourIncluded as TourInclusions).notIncluded : [],
                requirements: Array.isArray((tourIncluded as TourInclusions).requirements) ? (tourIncluded as TourInclusions).requirements : []
            };
        }
    }

    const hasContent = inclusions.included.length > 0 || inclusions.notIncluded.length > 0 || inclusions.requirements.length > 0;

    if (!hasContent) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No inclusion details available for this tour.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">What's Included & Requirements</h2>

            {inclusions.included.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />
                        <h3 className="text-sm font-semibold text-gray-900">What's Included</h3>
                    </div>
                    <div className="space-y-2">
                        {inclusions.included.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-green-50 p-2 sm:p-3 rounded-lg border border-green-100">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {inclusions.notIncluded.length > 0 && (
                <>
                    <div className="border-t border-gray-200"></div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />
                            <h3 className="text-sm font-semibold text-gray-900">What's Not Included</h3>
                        </div>
                        <div className="space-y-2">
                            {inclusions.notIncluded.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100">
                                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {inclusions.requirements.length > 0 && (
                <>
                    <div className="border-t border-gray-200"></div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
                            <h3 className="text-sm font-semibold text-gray-900">Requirements</h3>
                        </div>
                        <div className="space-y-2">
                            {inclusions.requirements.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

const DetailsPage = () => {
    const navigate = useNavigate();
    const { tourId } = useParams<{ tourId: string }>();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'schedule' | 'included'>('schedule');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tourData, setTourData] = useState<Record<string, unknown> | null>(null);
    const [providerData, setProviderData] = useState<Record<string, unknown> | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let tour: Record<string, unknown> | null = null;

                // Fetch fresh tour data to get all fields
                if (tourId) {
                    try {
                        tour = await tourService.getTourById(tourId);
                    } catch {
                        // Will fallback to navigation state
                    }
                }

                // Fallback to navigation state if API fetch failed
                if (!tour) {
                    const stateData = location.state as { tour?: Record<string, unknown> } | null;
                    if (stateData?.tour) {
                        tour = stateData.tour;
                    }
                }

                // If still no tour data, show error
                if (!tour) {
                    setError('Tour not found');
                    setLoading(false);
                    return;
                }

                setTourData(tour);

                if (tour.agency_id || tour.guide_id) {
                    try {
                        const providerId = String(tour.agency_id || tour.guide_id);
                        const providerType = tour.agency_id ? 'agency' : 'guide';
                        const providerResponse = await profileService.getProfile(providerId, providerType);
                        setProviderData(providerResponse.data || providerResponse);
                    } catch {
                        setProviderData(null);
                    }
                } else {
                    setProviderData(null);
                }
            } catch {
                setError('Failed to load tour details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tourId, location.state]);

    const handleBookNow = () => {
        setBookingLoading(true);
        if (!tourData) return;


        // Navigate to booking page with tour ID as state
        const tourId = String(tourData.tour_id || tourData.id || '');
        navigate(`${ROUTES.BOOKING}/${tourId}`, {
            state: { tourData }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#4d8b8b]" />
                    <p className="text-gray-600">Loading tour details...</p>
                </div>
            </div>
        );
    }

    if (error || !tourData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-bold mb-2">Failed to Load Tour</h3>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(ROUTES.EXPLORE)}
                        className="px-4 py-2 bg-[#4d8b8b] text-white rounded-lg hover:bg-[#274345] transition-colors"
                    >
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    const provider = providerData;

    return (
        <div className="w-full overflow-x-hidden min-w-0">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                <button className="rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-md text-shadow-black font-semibold hover:bg-lime-300 flex items-center mb-4 sm:mb-6 transition-colors" onClick={() => navigate(ROUTES.EXPLORE)}>
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 inline-block mr-2" />
                    Back to Explore</button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2 sm:gap-4 lg:gap-6 px-2 sm:px-4 lg:px-6 pb-3 sm:pb-6">

                <div className="space-y-4 sm:space-y-6">

                    <div className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
                        <img
                            src={String(tourData.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470')}
                            alt={String(tourData.tour_title || tourData.title || 'Tour')}
                            className="w-full h-48 sm:h-64 md:h-80 object-cover"
                        />

                        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
                            <img
                                src={String(tourData.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470')}
                                alt="Tour gallery 1"
                                className="w-full max-w-full h-auto object-cover rounded-xl"
                            />
                            <img
                                src={String(tourData.image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1')}
                                alt="Tour gallery 2"
                                className="w-full max-w-full h-auto object-cover rounded-xl"
                            />
                            <img
                                src={String(tourData.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e')}
                                alt="Tour gallery 3"
                                className="w-full max-w-full h-auto object-cover rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white shadow-md p-4 sm:p-6 space-y-4">
                        <h1 className="text-xl sm:text-2xl font-semibold">{String(tourData.tour_title || tourData.title || 'Untitled Tour')}</h1>
                        <p className="text-gray-600">{String(tourData.tour_details || tourData.description || 'No description available')}</p>

                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <MapPin className="w-4 h-4" />
                                {String(tourData.location || 'Unknown Location')}
                            </span>
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <Clock className="w-4 h-4" />
                                {String(tourData.duration || 'N/A')}
                            </span>
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <Users className="w-4 h-4" />
                                {String(tourData.group_size || tourData.groupSize || 'N/A')}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-2 hover:bg-green-200 transition-colors">
                                <Star className="w-4 h-4" />
                                {Number(tourData.rating || 0).toFixed(1)} ({Number(tourData.review_count || 0)} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-center font-semibold transition-all duration-300 ${activeTab === 'schedule'
                                    ? 'bg-white text-[#4d8b8b] border-b-2 border-[#4d8b8b]'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Day-by-Day Schedule
                            </button>
                            <button
                                onClick={() => setActiveTab('included')}
                                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-center font-semibold transition-all duration-300 ${activeTab === 'included'
                                    ? 'bg-white text-[#4d8b8b] border-b-2 border-[#4d8b8b]'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                What's Included
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div
                                key={activeTab}
                                className="animate-fadeIn"
                            >
                                {activeTab === 'schedule'
                                    ? <DayByDayScheduleTab tourDetails={tourData.tour_details as string | DaySchedule[] | null} />
                                    : <WhatsIncludedTab tourIncluded={tourData.tour_included as string | TourInclusions | null} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 h-fit sticky top-20">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
                        <h2 className="text-sm font-semibold mb-4">Book This Tour</h2>
                        <div className="space-y-4">
                            <div className="flex flex-row gap-2">
                                <div className="text-3xl font-bold text-[#4d8b8b]">{Number(tourData.price || 0)} DZD</div>
                                <div className="translate-y-2 text-sm text-gray-600">per person</div>
                            </div>
                        </div>
                        <div className="bg-gray-300 h-px my-4"></div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Duration</div>
                                <div className="text-sm font-semibold text-gray-900">{String(tourData.duration || 'N/A')}</div>
                            </div>
                        </div>
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Group Size</div>
                                <div className="text-sm font-semibold text-gray-900">{String(tourData.group_size || tourData.groupSize || 'N/A')}</div>
                            </div>
                        </div>
                        <div className="bg-gray-300 h-px my-4"></div>

                        <button
                            onClick={handleBookNow}
                            disabled={bookingLoading}
                            className="w-full bg-[#4d8b8b] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#274345] transition-colors flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book Now
                                </>
                            )}
                        </button>
                        <button className="w-full bg-white text-black mt-3 px-4 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-sm">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Send Inquiry
                        </button>
                    </div>
                    {provider ? (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-900">Tour Provider</h2>
                                {Boolean(provider.verified) && (
                                    <span className="inline-flex items-center gap-1 bg-[#4d8b8b] text-white text-xs font-medium px-3 py-1 rounded-full">
                                        <ShieldCheck className="w-4 h-4" /> Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#4d8b8b]/10 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-[#4d8b8b]" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                                        {String(provider.agency_name || provider.guide_name || provider.name || 'Unknown Provider')}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <MapPin className="w-3.5 h-3.5" /> {String(provider.main_office_location || provider.location || 'Unknown Location')}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-800 font-medium">
                                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                                        {(() => {
                                            const rawRating = Number(provider.rating || 0);
                                            const numRaters = Number(provider.num_raters || 0);
                                            const displayRating = rawRating > 5 && numRaters > 0 ? (rawRating / numRaters) : rawRating;
                                            return `${Math.min(5, displayRating).toFixed(1)} (${numRaters} reviews)`;
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 mt-4 leading-relaxed">{String(provider.agency_description || provider.guide_description || provider.description || 'No description available')}</p>
                            <div className="my-4 border-t border-gray-200"></div>
                            <div className="space-y-3 text-sm">
                                {provider.working_hours ? (
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4" /> Working Hours</span>
                                        <span className="font-semibold text-gray-900">
                                            {String(provider.working_hours)}
                                        </span>
                                    </div>
                                ) : null}
                                {provider.service_locations ? (
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /> Service Areas</span>
                                        <span className="font-semibold text-gray-900 text-right max-w-[60%]">
                                            {String(provider.service_locations)}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                            <div className="my-4 border-t border-gray-200"></div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4" />
                                    {String(provider.phone_number || 'N/A')}
                                </div>
                                {provider.support_email ? (
                                    <div className="flex items-center gap-2 text-gray-700 break-all">
                                        <Mail className="w-4 h-4" />
                                        {String(provider.support_email)}
                                    </div>
                                ) : null}
                                {provider.website ? (
                                    <div className="flex items-center gap-2 text-gray-700 break-all">
                                        <Globe className="w-4 h-4" />
                                        <a
                                            href={String(provider.website).startsWith('http') ? String(provider.website) : `https://${String(provider.website)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#4d8b8b] hover:underline"
                                        >
                                            {String(provider.website)}
                                        </a>
                                    </div>
                                ) : null}
                                {provider.emergency_contact ? (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-red-500" />
                                        <span className="text-red-600">Emergency: {String(provider.emergency_contact)}</span>
                                    </div>
                                ) : null}
                            </div>
                            <button className="w-full mt-5 bg-white text-gray-900 px-4 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors text-sm">
                                View All Tours
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-900">Tour Provider</h2>
                            </div>
                            <p className="text-sm text-gray-500 text-center py-4">Provider information not available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;

