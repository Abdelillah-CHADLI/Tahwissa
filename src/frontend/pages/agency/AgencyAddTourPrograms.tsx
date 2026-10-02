import { Button, Notice } from '../../components/ui';
import { useFeedback } from '../../components/ui/FeedbackProvider';
import { motion } from 'motion/react';
import { useState, useId, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Shield, Upload, Loader2 } from 'lucide-react';
import { getApiErrorMessage, tourService } from '../../services/api';

interface TourFormData {
    title: string;
    description: string;
    location: string;
    duration: string;
    groupSize: string;
    price: string;
    category: string;
    startDate: string;
    days: { id: number; title: string; description: string; activities: string[]; meals: string; accommodation: string }[];
    included: string[];
    notIncluded: string[];
    requirements: string[];
    images: string[]; // URLs or base64
    imageFiles: File[]; // Actual files for upload
}

const initialFormData: TourFormData = {
    title: '',
    description: '',
    location: '',
    duration: '',
    groupSize: '',
    price: '',
    category: '',
    startDate: '',
    days: [{ id: 1, title: '', description: '', activities: [''], meals: '', accommodation: '' }],
    included: [''],
    notIncluded: [''],
    requirements: [''],
    images: [],
    imageFiles: []
};

function BasicInfoTab({ data, updateData, onNext }: { data: TourFormData; updateData: (updates: Partial<TourFormData>) => void; onNext: () => void }) {
  const id = useId();
  const fields = [['title', 'Tour name', 'text', 'Sahara desert adventure'], ['location', 'Location', 'text', 'City or region'], ['duration', 'Duration', 'text', '5 days, 4 nights'], ['groupSize', 'Group size', 'text', '4–12 people'], ['price', 'Price per person (DZD)', 'number', '5000'], ['category', 'Category', 'text', 'Desert Tours'], ['startDate', 'Departure date', 'date', '']] as const;
  return <form onSubmit={event => { event.preventDefault(); onNext(); }} className="space-y-6">
    <div><h2 className="form-section-title">The essentials</h2><p className="field-hint">All fields are required. These details help travelers choose the right trip.</p></div>
    <div className="grid gap-5 sm:grid-cols-2">{fields.map(([key,label,type,placeholder]) => <div key={key} className={key === 'title' ? 'sm:col-span-2' : ''}><label className="field-label mb-1.5" htmlFor={id + key}>{label}</label><input id={id + key} className="field" type={type} required value={data[key]} placeholder={placeholder} min={type === 'number' ? 0 : type === 'date' ? new Date().toLocaleDateString('en-CA') : undefined} step={type === 'number' ? '0.01' : undefined} onChange={event => updateData({ [key]: event.target.value })} /></div>)}</div>
    <div><label className="field-label mb-1.5" htmlFor={id+'description'}>Tour description</label><textarea id={id+'description'} className="field resize-y" required rows={4} value={data.description} onChange={event => updateData({ description: event.target.value })} placeholder="What makes this trip special? Describe the places and experiences travelers can expect." /></div>
    <div className="flex justify-end border-t border-line pt-4"><Button type="submit">Continue to itinerary<ChevronRight size={16} /></Button></div>
  </form>;
}

function DayByDayScheduleTab({ data, updateData, onPrev, onNext }: { data: TourFormData; updateData: (updates: Partial<TourFormData>) => void; onPrev: () => void; onNext: () => void }) {
    const addDay = () => {
        const newDayId = data.days.length + 1;
        updateData({ 
            days: [...data.days, { id: newDayId, title: '', description: '', activities: [''], meals: '', accommodation: '' }] 
        });
    };

    const removeDay = () => {
        if (data.days.length === 1) return;
        updateData({ days: data.days.slice(0, -1) });
    };

    const updateDay = (index: number, field: string, value: string) => {
        const newDays = [...data.days];
        newDays[index] = { ...newDays[index], [field]: value };
        updateData({ days: newDays });
    };

    const addActivity = (dayIndex: number) => {
        const newDays = [...data.days];
        newDays[dayIndex].activities.push('');
        updateData({ days: newDays });
    };

    const removeActivity = (dayIndex: number, activityIndex: number) => {
        const newDays = [...data.days];
        if (newDays[dayIndex].activities.length === 1) return;
        newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, idx) => idx !== activityIndex);
        updateData({ days: newDays });
    };

    const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
        const newDays = [...data.days];
        newDays[dayIndex].activities[activityIndex] = value;
        updateData({ days: newDays });
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

            {data.days.map((day, index) => (
                <div key={day.id} className="relative border border-gray-200 rounded-xl p-4 md:p-6 space-y-5 bg-gray-50">
                    {data.days.length > 1 && index === data.days.length - 1 && (
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
                                    aria-label={`Day ${day.id} title`} value={day.title}
                                    onChange={(e) => updateDay(index, 'title', e.target.value)}
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
                                    aria-label={`Day ${day.id} description`} value={day.description}
                                    onChange={(e) => updateDay(index, 'description', e.target.value)}
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
                                        onClick={() => addActivity(index)}
                                        className="flex items-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Activity
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {day.activities.map((activity, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                aria-label={`Day ${day.id} activity ${actIdx + 1}`} value={activity}
                                                onChange={(e) => updateActivity(index, actIdx, e.target.value)}
                                                placeholder={`Activity ${actIdx + 1}`}
                                                className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-white"
                                            />
                                            {day.activities.length > 1 && (
                                                <button
                                                    aria-label="Remove activity" onClick={() => removeActivity(index, actIdx)}
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
                                        aria-label={`Day ${day.id} meals`} value={day.meals}
                                        onChange={(e) => updateDay(index, 'meals', e.target.value)}
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
                                        aria-label={`Day ${day.id} accommodation`} value={day.accommodation}
                                        onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
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
                    Back to essentials
                </button>
                <button 
                    onClick={onNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    Continue to inclusions
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function WhatsIncludedTab({ data, updateData, onPrev, onNext }: { data: TourFormData; updateData: (updates: Partial<TourFormData>) => void; onPrev: () => void; onNext: () => void }) {
    const updateList = (field: 'included' | 'notIncluded' | 'requirements', index: number, value: string) => {
        const newList = [...data[field]];
        newList[index] = value;
        updateData({ [field]: newList });
    };

    const addToList = (field: 'included' | 'notIncluded' | 'requirements') => {
        updateData({ [field]: [...data[field], ''] });
    };

    const removeFromList = (field: 'included' | 'notIncluded' | 'requirements', index: number) => {
        if (data[field].length === 1) return;
        updateData({ [field]: data[field].filter((_, idx) => idx !== index) });
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
                        onClick={() => addToList('included')}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {data.included.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                aria-label={`List item ${idx + 1}`} value={item}
                                onChange={(e) => updateList('included', idx, e.target.value)}
                                placeholder="e.g., Airport pickup and drop-off"
                                className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {data.included.length > 1 && (
                                <button
                                    aria-label="Remove item" onClick={() => removeFromList('included', idx)}
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
                        onClick={() => addToList('notIncluded')}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {data.notIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                aria-label={`List item ${idx + 1}`} value={item}
                                onChange={(e) => updateList('notIncluded', idx, e.target.value)}
                                placeholder="e.g., International flights"
                                className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {data.notIncluded.length > 1 && (
                                <button
                                    aria-label="Remove item" onClick={() => removeFromList('notIncluded', idx)}
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
                        <Shield className="w-6 h-6 text-brand" />
                        <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
                    </div>
                    <button
                        onClick={() => addToList('requirements')}
                        className="w-full sm:w-auto flex items-center justify-center gap-1 text-sm text-[#375E5E] hover:text-[#2c4b4b] font-medium px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Requirement
                    </button>
                </div>
                <div className="space-y-2">
                    {data.requirements.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                aria-label={`List item ${idx + 1}`} value={item}
                                onChange={(e) => updateList('requirements', idx, e.target.value)}
                                placeholder="e.g., Moderate fitness level required"
                                className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-[#375E5E] focus:ring-1 focus:ring-[#375E5E] bg-gray-50"
                            />
                            {data.requirements.length > 1 && (
                                <button
                                    aria-label="Remove item" onClick={() => removeFromList('requirements', idx)}
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
                    Back to itinerary
                </button>
                <button 
                    onClick={onNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-lime-300 transition-colors text-gray-700 font-medium"
                >
                    Continue to photos
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function ImagesTab({ data, updateData, onPrev, onPublish, loading }: { data: TourFormData; updateData: (updates: Partial<TourFormData>) => void; onPrev: () => void; onPublish: () => void; loading: boolean }) {
    const [imageError, setImageError] = useState('');
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (data.images.length + files.length > 10 || Array.from(files).some(file => file.size > 5 * 1024 * 1024 || !['image/png','image/jpeg','image/webp'].includes(file.type))) { setImageError('Choose up to 10 JPG, PNG, or WebP images, each under 5 MB.'); e.target.value = ''; return; }
            setImageError('');
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            const newFiles = Array.from(files);
            updateData({ 
                images: [...data.images, ...newImages],
                imageFiles: [...data.imageFiles, ...newFiles]
            });
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(data.images[index]);
        updateData({ 
            images: data.images.filter((_, idx) => idx !== index),
            imageFiles: data.imageFiles.filter((_, idx) => idx !== index)
        });
    };

    return (
        <div className="py-6 space-y-6">
            <h2 className="form-section-title">Tour images</h2>{imageError && <Notice tone="error">{imageError}</Notice>}

            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Upload Tour Images</h3>
                <p className="text-sm text-gray-500">
                    Add up to 10 photos to help travelers picture the experience. The first image will be used as the main cover photo.
                </p>
            </div>

            <label className="block">
                <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    aria-label="Upload tour photos" className="sr-only"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-[#375E5E] transition-colors cursor-pointer bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-base md:text-lg font-medium text-gray-700 mb-1">
                        Choose tour photos
                    </p>
                    <p className="text-sm text-gray-500">
                        PNG, JPG or WEBP (max. 5MB per image)
                    </p>
                </div>
            </label>

            {data.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                            <img
                                src={img}
                                alt={`Tour image ${idx + 1}`}
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                aria-label={`Remove photo ${idx + 1}`} onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 transition-opacity"
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
                    Back to inclusions
                </button>
                <button 
                    onClick={onPublish}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#375E5E] text-white rounded-lg py-2.5 px-6 hover:bg-[#2c4b4b] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Publish Tour
                </button>
            </div>
        </div>
    );
}

export function AgencyAddTourProgram() {
  const { notify } = useFeedback();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [formData, setFormData] = useState<TourFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const previews = useRef<string[]>([]);
    useEffect(() => () => { previews.current.forEach(url => URL.revokeObjectURL(url)); }, []);

    const updateFormData = (updates: Partial<TourFormData>) => {
        if (updates.images) previews.current = updates.images;
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handlePublish = async () => {
        if (loading) return;
        setError('');
        if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.duration.trim() || !formData.groupSize.trim() || !formData.category.trim() || !formData.startDate || !formData.price.trim() || !Number.isFinite(Number(formData.price)) || Number(formData.price) < 0) {
          setError('Complete the tour essentials before publishing.'); setActiveTab('Basic Info'); return;
        }
        if (new Date(formData.startDate + 'T23:59:59') < new Date()) { setError('Choose today or a future departure date.'); setActiveTab('Basic Info'); return; }
        if (formData.days.some(day => !day.title.trim() || !day.description.trim())) { setError('Give each itinerary day a title and description.'); setActiveTab('Day-by-Day Schedule'); return; }
        try {
            setLoading(true);
            await tourService.createTour(formData as unknown as Record<string, unknown>);
            notify('Tour created successfully!');
            navigate('/agency/tour-programs');
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const renderActiveForm = () => {
        switch (activeTab) {
            case 'Basic Info':
                return <BasicInfoTab data={formData} updateData={updateFormData} onNext={() => setActiveTab('Day-by-Day Schedule')} />;
            case 'Day-by-Day Schedule':
                return <DayByDayScheduleTab 
                    data={formData} updateData={updateFormData}
                    onPrev={() => setActiveTab('Basic Info')} 
                    onNext={() => setActiveTab("What's Included")} 
                />;
            case "What's Included":
                return <WhatsIncludedTab 
                    data={formData} updateData={updateFormData}
                    onPrev={() => setActiveTab('Day-by-Day Schedule')} 
                    onNext={() => setActiveTab('Images')} 
                />;
            case 'Images':
                return <ImagesTab 
                    data={formData} updateData={updateFormData}
                    onPrev={() => setActiveTab("What's Included")} 
                    onPublish={handlePublish}
                    loading={loading}
                />;
            default:
                return <BasicInfoTab data={formData} updateData={updateFormData} onNext={() => setActiveTab('Day-by-Day Schedule')} />;
        }
    };

    return (
        <div className='w-full'>
            <div className="space-y-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="panel panel-body">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <button 
                                    aria-label="Back to tour programs" onClick={() => navigate('/agency/tour-programs')}
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
                                    onClick={handlePublish}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-[#375E5E] text-white rounded-lg py-2.5 px-4 hover:bg-[#2c4b4b] transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>Publish Tour</span>
                                </button>
                            </div>
                        </div>
                        {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
                        <div className="segmented-tabs">
                            {["Basic Info", "Day-by-Day Schedule", "What's Included", "Images"].map((tab) => (
                                <button
                                    key={tab} aria-pressed={activeTab === tab} disabled={loading}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        shrink-0 px-3 py-3 font-medium text-sm transition-colors relative
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
                            <fieldset disabled={loading}>{renderActiveForm()}</fieldset>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
