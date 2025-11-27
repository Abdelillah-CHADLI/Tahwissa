import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import { ArrowLeft, MapPin, Users, Clock, Star, CheckCircle, XCircle, Shield, Calendar, MessageCircle, ShieldCheck, Phone, Mail, Award, ListChecks, Building2 } from "lucide-react";
import { useState } from "react";
import { mockDaySchedule, mockTourInclusions } from "../../data/mockDetails";
import { mockTours } from "../../data/mockTours";
import { mockAgencyProvider } from "../../data/mockAgency";

function DayByDayScheduleTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Day-by-Day Itinerary</h2>
            
            {mockDaySchedule.map((day) => (
                <div key={day.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-gray-50">
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#4d8b8b] text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg">
                            {day.id}
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{day.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600">{day.description}</p>
                            
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

function WhatsIncludedTab() {
    return (
        <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">What's Included & Requirements</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-900">What's Included</h3>
                </div>
                <div className="space-y-2">
                    {mockTourInclusions.included.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-green-50 p-2 sm:p-3 rounded-lg border border-green-100">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-900">What's Not Included</h3>
                </div>
                <div className="space-y-2">
                    {mockTourInclusions.notIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-900">Requirements</h3>
                </div>
                <div className="space-y-2">
                    {mockTourInclusions.requirements.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const DetailsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'schedule' | 'included'>('schedule');

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
                        <img src="../src/frontend/data/mock_img.jpg"
                            className="w-full h-48 sm:h-64 md:h-80 object-cover" />

                        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
                            <img src="../src/frontend/data/mock_img.jpg" className="w-full max-w-full h-auto object-cover rounded-xl" />
                            <img src="../src/frontend/data/mock_img.jpg" className="w-full max-w-full h-auto object-cover rounded-xl" />
                            <img src="../src/frontend/data/mock_img.jpg" className="w-full max-w-full h-auto object-cover rounded-xl" />
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white shadow-md p-4 sm:p-6 space-y-4">
                        <h1 className="text-xl sm:text-2xl font-semibold">Sea View Resort Adventure</h1>
                        <p className="text-gray-600">Experience the magic of the Sea Resort Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit atque repudiandae eveniet eaque accusamus libero temporibus cumque iste quae a, aliquam molestias, laborum repellat. Explicabo, a quo? Labore, omnis placeat.</p>

                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <MapPin className="w-4 h-4" />
                                Jijel, Algeria
                            </span>
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <Clock className="w-4 h-4" />
                                5 Days / 4 Nights
                            </span>
                            <span className="bg-[#4d8b8b] text-white text-sm px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#274345] transition-colors">
                                <Users className="w-4 h-4" />
                                4-10 people
                            </span>
                        </div>
                        <div className="flex">
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-2 hover:bg-green-200 transition-colors">
                                <Star className="w-4 h-4" />
                                4.8 (256 reviews)
                            </span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-center font-semibold transition-all duration-300 ${
                                    activeTab === 'schedule'
                                        ? 'bg-white text-[#4d8b8b] border-b-2 border-[#4d8b8b]'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                Day-by-Day Schedule
                            </button>
                            <button
                                onClick={() => setActiveTab('included')}
                                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-center font-semibold transition-all duration-300 ${
                                    activeTab === 'included'
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
                                {activeTab === 'schedule' ? <DayByDayScheduleTab /> : <WhatsIncludedTab />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 h-fit sticky top-20">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
                        <h2 className="text-sm font-semibold mb-4">Book This Tour</h2>
                        {mockTours.slice(0,1).map(tour => (
                            <div key={tour.id} className="space-y-4">
                                <div className="flex flex-row gap-2">
                                    <div className="text-3xl font-bold text-[#4d8b8b]">{tour.price} DZD</div>
                                    <div className="translate-y-2 text-sm text-gray-600">per person</div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-gray-300 h-px my-4"></div>
                        {mockTours.slice(0,1).map(tour => (
                            <div key={tour.id} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">Duration</div>
                                    <div className="text-sm font-semibold text-gray-900">{tour.duration}</div>
                                </div>
                            </div>
                        ))}
                        {mockTours.slice(0,1).map(tour => (
                            <div key={tour.id} className="space-y-4 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">Group Size</div>
                                    <div className="text-sm font-semibold text-gray-900">{tour.groupSize}</div>
                                </div>
                            </div>
                        ))}
                        <div className="bg-gray-300 h-px my-4"></div>
                        <button className="w-full bg-[#4d8b8b] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#274345] transition-colors flex items-center justify-center text-sm">
                            <Calendar className="w-5 h-5 mr-2" />
                            Book Now
                        </button>
                        <button className="w-full bg-white text-black mt-3 px-4 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-sm">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Send Inquiry
                        </button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-900">Tour Provider</h2>
                            {mockAgencyProvider.verified && (
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
                                <h3 className="text-base font-semibold text-gray-900 leading-tight">{mockAgencyProvider.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <MapPin className="w-3.5 h-3.5" /> {mockAgencyProvider.location.city}, {mockAgencyProvider.location.country}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-800 font-medium">
                                    <Star className="w-3.5 h-3.5 text-yellow-500" /> {mockAgencyProvider.rating.toFixed(1)} ({mockAgencyProvider.reviewsCount} reviews)
                                </div>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 mt-4 leading-relaxed">{mockAgencyProvider.description}</p>
                        <div className="my-4 border-t border-gray-200"></div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-600"><Award className="w-4 h-4" /> Experience</span>
                                <span className="font-semibold text-gray-900">{mockAgencyProvider.experienceYears} years</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-gray-600"><ListChecks className="w-4 h-4" /> Tours Offered</span>
                                <span className="font-semibold text-gray-900">{mockAgencyProvider.toursOffered} tours</span>
                            </div>
                        </div>
                        <div className="my-4 border-t border-gray-200"></div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-4 h-4" /> {mockAgencyProvider.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 break-all">
                                <Mail className="w-4 h-4" /> {mockAgencyProvider.email}
                            </div>
                        </div>
                        <button className="w-full mt-5 bg-white text-gray-900 px-4 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors text-sm">
                            View All Tours
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;

