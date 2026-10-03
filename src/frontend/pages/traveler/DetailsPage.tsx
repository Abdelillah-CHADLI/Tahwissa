import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { ArrowLeft, MapPin, Users, Clock, Star, CheckCircle, XCircle, Shield, Calendar, MessageCircle, ShieldCheck, Phone, Mail, Globe, Building2, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { tourService, profileService } from "../../services/api";
import { Button, PageState } from '../../components/ui';

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

const parseStringArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((x) => (typeof x === 'string' ? x : String(x))).filter(Boolean);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.map((x) => (typeof x === 'string' ? x : String(x))).filter(Boolean);
            } catch {
                // fallthrough
            }
        }
        return trimmed.split(/[\n,•-]+/g).map(s => s.trim()).filter(Boolean);
    }
    return [];
};

const getTourImageUrls = (tour: Record<string, unknown>): string[] => {
    const urls: string[] = [];
    const add = (u: unknown) => {
        if (typeof u === 'string' && u.trim()) urls.push(u);
    };

    const images = (tour as any).images;
    if (Array.isArray(images)) {
        for (const item of images) {
            if (typeof item === 'string') add(item);
            else if (item && typeof item === 'object') add((item as any).image_url || (item as any).url);
        }
    }

    const tourImages = (tour as any).tour_images;
    if (Array.isArray(tourImages)) {
        for (const item of tourImages) {
            if (typeof item === 'string') add(item);
            else if (item && typeof item === 'object') add((item as any).image_url);
        }
    }

    add((tour as any).image);
    add((tour as any).image_url);
    add((tour as any).cover_image);

    return urls;
};

const parseTourDescription = (tourDetails: unknown, fallbackTitle?: string): string => {
    if (typeof tourDetails !== 'string' || !tourDetails.trim()) {
        return 'No description available';
    }
    if (!tourDetails.startsWith('[') && !tourDetails.startsWith('{')) {
        return tourDetails;
    }
    try {
        const parsed = JSON.parse(tourDetails);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0]?.description || parsed[0]?.title || fallbackTitle || 'No description available';
        }
        if (parsed && typeof parsed === 'object') {
            return parsed.description || parsed.title || fallbackTitle || 'No description available';
        }
    } catch {
        return 'No description available';
    }
    return 'No description available';
};

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

    if (loading) return <div className="page-shell"><PageState kind="loading" title="Loading tour details" /></div>;

    if (error || !tourData) {
        return <div className="page-shell"><PageState kind="error" title="Unable to load this tour" description={error || 'The tour may no longer be available.'} action={<Button onClick={() => navigate(ROUTES.EXPLORE)}>Explore tours</Button>} /></div>;
    }

    const provider = providerData;

    const imageUrls = getTourImageUrls(tourData);
    const coverImage = imageUrls[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470';

    // Check if tour has ended (start_date in the past)
    const startDate = tourData.start_date as string | undefined;
    const isEnded = startDate ? new Date(startDate) < new Date(new Date().toDateString()) : false;

    const inclusionsMerged: TourInclusions = {
        included: parseStringArray((tourData as any).tour_included),
        notIncluded: parseStringArray((tourData as any).tour_not_included),
        requirements: parseStringArray((tourData as any).requirements),
    };

    return (
        <div className="w-full min-w-0">
            <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-7">
                <button className="button button-quiet -ml-3" onClick={() => navigate(ROUTES.EXPLORE)}>
                    <ArrowLeft size={18} aria-hidden="true" /> Back to tours</button>
            </div>

            <div className="mx-auto grid max-w-7xl min-w-0 grid-cols-1 gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:gap-7">

                <div className="space-y-4 sm:space-y-6">

                    <div className="overflow-hidden rounded-xl bg-white">
                        <img
                            src={String(coverImage)}
                            alt={String(tourData.tour_title || tourData.title || 'Tour')}
                            className="w-full h-48 sm:h-64 md:h-80 object-cover"
                        />

                        {imageUrls.length > 1 && (
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
                                {imageUrls.slice(1, 4).map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={String(url)}
                                        alt={`Tour gallery ${idx + 1}`}
                                        className="w-full aspect-[4/3] object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 py-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{String(tourData.tour_title || tourData.title || 'Untitled Tour')}</h1>
                        <p className="text-gray-600">{parseTourDescription(tourData.tour_details, String(tourData.tour_title || tourData.title || ''))}</p>

                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-2 text-sm text-muted">
                                <MapPin className="w-4 h-4" />
                                {String(tourData.location || 'Unknown Location')}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm text-muted">
                                <Clock className="w-4 h-4" />
                                {String(tourData.duration || 'N/A')}
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm text-muted">
                                <Users className="w-4 h-4" />
                                {String(tourData.group_size || tourData.groupSize || 'N/A')}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink">
                                <Star className="w-4 h-4" />
                                {Number(tourData.rating || 0).toFixed(1)} ({Number(tourData.review_count || 0)} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="panel overflow-hidden">
                        <div className="flex overflow-x-auto border-b border-line bg-white">
                            <button
                                aria-pressed={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}
                                className={`min-h-12 flex-1 whitespace-nowrap px-4 text-center text-sm font-semibold transition-colors ${activeTab === 'schedule'
                                    ? 'border-b-2 border-brand text-brand'
                                    : 'text-gray-600 hover:bg-brand-soft hover:text-brand'
                                    }`}
                            >
                                Day-by-Day Schedule
                            </button>
                            <button
                                aria-pressed={activeTab === 'included'} onClick={() => setActiveTab('included')}
                                className={`min-h-12 flex-1 whitespace-nowrap px-4 text-center text-sm font-semibold transition-colors ${activeTab === 'included'
                                    ? 'border-b-2 border-brand text-brand'
                                    : 'text-gray-600 hover:bg-brand-soft hover:text-brand'
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
                                    : <WhatsIncludedTab tourIncluded={inclusionsMerged} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 h-fit lg:sticky lg:top-20">
                    <div className="panel p-4 sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold text-brand-ink">Request this tour</h2>
                        
                        {isEnded && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                <div>
                                    <p className="text-red-800 font-medium text-sm">This tour has ended</p>
                                    <p className="text-red-600 text-xs">The start date for this tour has passed. Bookings are no longer available.</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <div className="text-2xl font-bold tracking-tight text-brand-ink">{Number(tourData.price || 0).toLocaleString()} DZD</div>
                                <div className="text-sm text-gray-600">per person</div>
                            </div>
                        </div>
                        <div className="bg-gray-300 h-px my-4"></div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-gray-600">Duration</div>
                                <div className="text-sm font-semibold text-gray-900">{String(tourData.duration || 'N/A')}</div>
                            </div>
                        </div>
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-gray-600">Group Size</div>
                                <div className="text-sm font-semibold text-gray-900">{String(tourData.group_size || tourData.groupSize || 'N/A')}</div>
                            </div>
                        </div>
                        {startDate && (
                            <div className="space-y-4 py-2">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm text-gray-600">Start Date</div>
                                    <div className={`text-sm font-semibold ${isEnded ? 'text-red-600' : 'text-gray-900'}`}>
                                        {new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        {isEnded && ' (Ended)'}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="bg-gray-300 h-px my-4"></div>

                        <button
                            onClick={handleBookNow}
                            disabled={bookingLoading || isEnded}
                            className={`button w-full ${
                                isEnded 
                                    ? 'bg-gray-400 text-white'
                                    : 'button-primary'
                            }`}
                        >
                            {bookingLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Booking...
                                </>
                            ) : isEnded ? (
                                <>
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Tour Ended
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book Now
                                </>
                            )}
                        </button>
                        <button disabled={!tourData.agency_id && !tourData.guide_id} onClick={() => navigate(`/traveler/guide-profile/${tourData.agency_id ? 'agency' : 'guide'}/${tourData.agency_id || tourData.guide_id}`, { state: { section: 'contact' } })} className="button button-secondary mt-3 w-full">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Contact provider
                        </button>
                    </div>
                    {provider ? (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
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
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4" /> Working Hours</span>
                                        <span className="font-semibold text-gray-900">
                                            {String(provider.working_hours)}
                                        </span>
                                    </div>
                                ) : null}
                                {provider.service_locations ? (
                                    <div className="flex items-center justify-between gap-3">
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
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
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

