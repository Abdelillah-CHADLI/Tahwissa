import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Clock, Users, DollarSign, MapPin, Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Shield, Upload } from 'lucide-react';

function BasicInfoTab({ onNext }: { onNext: () => void }) {
    return (
        <div className="p-2 space-y-5">
            <h3 className="text-xl font-semibold text-gray-600">Basic Tour Information</h3>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Tour Name *</label>
                <input type="text" placeholder='e.g: Sahara Desert Adventure' className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#000000] resize-none" rows={4}>
                </textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></MapPin>
                    <input type="text" placeholder="e.g: Algiers, Tamanrasset" className="mt-1 w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration *</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></Clock>
                    <input type="text" placeholder='e.g: 5 Days and 4 Nights' className="mt-1 w-full px-3 pl-12 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Group Size *</label>
                <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></Users>
                    <input type="number" placeholder='e.g: 4-12 people' className="mt-1 w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Price (DZD)*</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></DollarSign>
                    <input type="number" placeholder='e.g: 5000' className="mt-1 w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
                </div>
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <input type="text" placeholder="e.g: Adventure, Cultural" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#000000]"></input>
            </div>
            <div className="flex justify-end pt-4">
                <button 
                    onClick={onNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    Next ' Schedule '
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function DayByDayScheduleTab({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
    const [days, setDays] = useState([{ id: 1 }]);
    const [activities, setActivities] = useState<Record<number, string[]>>({ 1: [''] });

    const addDay = () => {
        const newDayId = days.length + 1;
        setDays([...days, { id: newDayId }]);
        setActivities({ ...activities, [newDayId]: [''] });
    };

    const removeDay = () => {
        if (days.length === 1) return; // Keep at least one day
        const lastDayId = days[days.length - 1].id;
        setDays(days.slice(0, -1));
        const newActivities = { ...activities };
        delete newActivities[lastDayId];
        setActivities(newActivities);
    };

    const addActivity = (dayId: number) => {
        setActivities({
            ...activities,
            [dayId]: [...(activities[dayId] || []), '']
        });
    };

    const removeActivity = (dayId: number, activityIndex: number) => {
        if (activities[dayId].length === 1) return; // Keep at least one activity
        setActivities({
            ...activities,
            [dayId]: activities[dayId].filter((_, idx) => idx !== activityIndex)
        });
    };

    return (
        <div className="py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Day-by-Day Itinerary</h2>
                <button
                    onClick={addDay}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#375E5E] text-white rounded-lg py-2 px-4 hover:bg-[#2c4b4b] transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Day
                </button>
            </div>

            {days.map((day) => (
                <div key={day.id} className="relative border border-gray-200 rounded-xl p-4 md:p-6 space-y-5 bg-gray-50">
                    {days.length > 1 && (
                        <button
                            onClick={removeDay}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                            title="Remove Last Day"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#375E5E] text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {day.id}
                        </div>

                        <div className="flex-1 w-full space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Day {day.id} Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Arrival & Desert Introduction"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe what happens on this day"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] resize-none bg-white"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Activities *
                                    </label>
                                    <button
                                        onClick={() => addActivity(day.id)}
                                        className="flex items-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Activity
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {(activities[day.id] || ['']).map((_activity, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Activity ${actIdx + 1}`}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-white"
                                            />
                                            {activities[day.id].length > 1 && (
                                                <button
                                                    onClick={() => removeActivity(day.id, actIdx)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meals Included
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Breakfast, Lunch, Dinner"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Accommodation
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Desert Camp (Tents)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
                <button 
                    onClick={onPrev}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous ' Basic Info '
                </button>
                <button 
                    onClick={onNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    Next ' What's Included '
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function WhatsIncludedTab({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
    const [includedItems, setIncludedItems] = useState<string[]>(['']);
    const [notIncludedItems, setNotIncludedItems] = useState<string[]>(['']);
    const [requirements, setRequirements] = useState<string[]>(['']);

    const addIncludedItem = () => {
        setIncludedItems([...includedItems, '']);
    };

    const removeIncludedItem = (index: number) => {
        if (includedItems.length === 1) return;
        setIncludedItems(includedItems.filter((_, idx) => idx !== index));
    };

    const addNotIncludedItem = () => {
        setNotIncludedItems([...notIncludedItems, '']);
    };

    const removeNotIncludedItem = (index: number) => {
        if (notIncludedItems.length === 1) return;
        setNotIncludedItems(notIncludedItems.filter((_, idx) => idx !== index));
    };

    const addRequirement = () => {
        setRequirements([...requirements, '']);
    };

    const removeRequirement = (index: number) => {
        if (requirements.length === 1) return;
        setRequirements(requirements.filter((_, idx) => idx !== index));
    };

    return (
        <div className="py-6 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">What's Included & Requirements</h2>

            
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                    </div>
                    <button
                        onClick={addIncludedItem}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {includedItems.map((_item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="e.g., Airport pickup and drop-off"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {includedItems.length > 1 && (
                                <button
                                    onClick={() => removeIncludedItem(idx)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200"></div>

            
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">What's Not Included</h3>
                    </div>
                    <button
                        onClick={addNotIncludedItem}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {notIncludedItems.map((_item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="e.g., International flights"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {notIncludedItems.length > 1 && (
                                <button
                                    onClick={() => removeNotIncludedItem(idx)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200"></div>

           
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                    </div>
                    <button
                        onClick={addRequirement}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Requirement
                    </button>
                </div>
                <div className="space-y-2">
                    {requirements.map((_req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="e.g., Moderate fitness level required"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {requirements.length > 1 && (
                                <button
                                    onClick={() => removeRequirement(idx)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
                <button 
                    onClick={onPrev}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous ' Schedule '
                </button>
                <button 
                    onClick={onNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    Next ' Images '
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function ImagesTab({ onPrev }: { onPrev: () => void }) {
    const navigate = useNavigate();
    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, idx) => idx !== index));
    };

    return (
        <div className="py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Tour Images</h2>

            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Upload Tour Images</h3>
                <p className="text-sm text-gray-500">
                    Add at least 3 high-quality images of your tour. The first image will be used as the main cover photo.
                </p>
            </div>

            
            <label className="block">
                <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-12 text-center hover:border-[#375E5E] transition-colors cursor-pointer bg-gray-50">
                    <Upload className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-base md:text-lg font-medium text-gray-700 mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                        PNG, JPG or WEBP (max. 5MB per image)
                    </p>
                </div>
            </label>

            
            {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group">
                            <img
                                src={img}
                                alt={`Tour image ${idx + 1}`}
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {idx === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-1 bg-[#375E5E] text-white text-xs font-medium rounded">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
                <button 
                    onClick={onPrev}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous ' What's Included '
                </button>
                <button 
                    onClick={() => navigate('/tour-programs')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#375E5E] text-white rounded-lg py-2.5 px-6 hover:bg-[#2c4b4b] transition-colors font-medium shadow-sm">
                    <Save className="w-4 h-4" />
                    Publish Tour
                </button>
            </div>
        </div>
    );
}

export function AgencyAddTourProgram() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Basic Info');
    const renderActiveForm = () => {
    switch (activeTab) {
        case 'Basic Info':
            return <BasicInfoTab onNext={() => setActiveTab('Day-by-Day Schedule')} />;
        case 'Day-by-Day Schedule':
            return <DayByDayScheduleTab 
                onPrev={() => setActiveTab('Basic Info')} 
                onNext={() => setActiveTab("What's Included")} 
            />;
        case "What's Included":
            return <WhatsIncludedTab 
                onPrev={() => setActiveTab('Day-by-Day Schedule')} 
                onNext={() => setActiveTab('Images')} 
            />;
        case 'Images':
            return <ImagesTab onPrev={() => setActiveTab("What's Included")} />;
        default:
            return <BasicInfoTab onNext={() => setActiveTab('Day-by-Day Schedule')} />;
    }
};
    return (
        <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
            <div className="space-y-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Create New Tour</h1>
                                    <p className="text-sm text-gray-500">Fill in the details below to add a new tour program.</p>
                                </div>
                            </div>

                            <div className="flex justify-end md:justify-start">
                                <button 
                                    onClick={() => navigate('/tour-programs')}
                                    className="flex items-center gap-2 bg-[#375E5E] text-white rounded-lg py-2.5 px-4 hover:bg-[#2c4b4b] transition-colors font-medium text-sm shadow-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Publish Tour</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between border-b border-gray-200">
                            {["Basic Info", "Day-by-Day Schedule", "What's Included", "Images"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        px-2 md:px-4 py-3 font-medium text-xs md:text-sm transition-all relative
                                        ${activeTab === tab
                                            ? "text-[#375E5E]"
                                            : "text-gray-500 hover:text-gray-700"
                                        }
                                    `}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#375E5E]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6"
                        >
                            {renderActiveForm()}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
