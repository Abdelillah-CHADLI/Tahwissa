import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, Upload, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, type ChangeEvent } from 'react';
import api, { profileService } from '../../services/api';
import { getCurrentAgencyUuid, getCurrentProfileType } from '../../utils/session';
import { getContextText } from '../../utils/userContext';

export function AgencyEditProfile() {
    const agencyId = getCurrentAgencyUuid();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        agency_name: '',
        agency_email: '',
        agency_phone: '',
        agency_website: '',
        description: '',
        location: '',
        emergency_phone: '',
        support_email: '',
        working_hours: ''
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    // Load profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!agencyId) {
                    throw new Error('No account found. Please sign in again.');
                }

                const profileType = getCurrentProfileType();
                if (!profileType) {
                    throw new Error('Unable to determine profile type.');
                }

                const response = await profileService.getProfile(agencyId, profileType);
                const profile = response.data || response.profile;

                if (profile) {
                    setFormData({
                        agency_name: profile.agency_name || profile.guide_name || '',
                        agency_email: profile.agency_email || profile.email || '',
                        agency_phone: profile.phone_number || '',
                        agency_website: profile.website || '',
                        description: profile.agency_description || profile.guide_description || '',
                        location: profile.main_office_location || profile.main_location || '',
                        emergency_phone: profile.emergency_contact || '',
                        support_email: profile.support_email || '',
                        working_hours: profile.working_hours || ''
                    });

                    if (profile.service_locations) {
                        if (typeof profile.service_locations === 'string') {
                            setSelectedLocations(profile.service_locations.split(',').map((s: string) => s.trim()));
                        } else if (Array.isArray(profile.service_locations)) {
                            setSelectedLocations(profile.service_locations);
                        }
                    }

                    // Load existing logo (agency_logo for agencies, guide_photo for guides)
                    if (profile.agency_logo || profile.guide_photo) {
                        setLogoPreview(profile.agency_logo || profile.guide_photo);
                    }
                } else {
                    throw new Error("Profile not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [agencyId]);

    const availableLocations = [
        'Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Béjaïa',
        'Tlemcen', 'Annaba',
    ];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setLogoPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleLocation = (location: string) => {
        if (selectedLocations.includes(location)) {
            setSelectedLocations(selectedLocations.filter(l => l !== location));
        } else {
            setSelectedLocations([...selectedLocations, location]);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            if (!agencyId) {
                setError('No account found. Please sign in again.');
                return;
            }

            const profileType = getCurrentProfileType();
            if (!profileType) {
                setError('Unable to determine profile type.');
                return;
            }

            // Upload logo if a new file was selected
            if (logoFile) {
                const formData = new FormData();
                formData.append('logo', logoFile);

                try {
                    const logoResponse = await api.post(`/profile1/agency/${agencyId}/logo`, formData);
                    if (logoResponse.data?.data?.agency_logo || logoResponse.data?.data?.guide_photo) {
                        setLogoPreview(logoResponse.data.data.agency_logo || logoResponse.data.data.guide_photo);
                        setLogoFile(null);
                    }
                } catch (logoErr) {
                    console.error('Logo upload failed:', logoErr);
                }
            }

            // Map form data based on profile type
            const dataToSend = profileType === 'agency' ? {
                agency_name: formData.agency_name,
                phone_number: formData.agency_phone,
                emergency_contact: formData.emergency_phone,
                support_email: formData.support_email || formData.agency_email,
                working_hours: formData.working_hours,
                service_locations: selectedLocations.join(', '),
                main_office_location: formData.location,
                website: formData.agency_website,
                agency_description: formData.description,
            } : {
                guide_name: formData.agency_name,
                phone_number: formData.agency_phone,
                emergency_contact: formData.emergency_phone,
                support_email: formData.support_email || formData.agency_email,
                working_hours: formData.working_hours,
                service_locations: selectedLocations.join(', '),
                main_location: formData.location,
                website: formData.agency_website,
                guide_description: formData.description,
            };

            await profileService.updateProfile(agencyId, dataToSend, profileType);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Reload the page to reset form
        window.location.reload();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#375E5E]" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Error Alert */}
            {error && (
                <div className="max-w-5xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="max-w-5xl mx-auto mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Save className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-green-800 font-medium">Success</p>
                        <p className="text-green-600 text-sm">Profile updated successfully!</p>
                    </div>
                </div>
            )}
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Agency Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">{getContextText('Agency Information', 'Guide Information')}</h2>

                        <div className="space-y-6">
                            {/* Logo Upload */}
                            <div className="flex items-start gap-6">
                                <div className="relative">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Agency Logo" className="w-24 h-24 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white text-2xl font-semibold">
                                            AT
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="logoUpload"
                                        accept="image/jpeg,image/png,image/svg+xml"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => document.getElementById('logoUpload')?.click()}
                                        className="flex items-center justify-center bg-lime-300 text-gray-900 hover:bg-lime-400 w-8 h-8 absolute bottom-0 right-0 rounded-full transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <h4 className="mb-1 font-medium text-gray-900">{getContextText('Agency Logo', 'Profile Photo')}</h4>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {getContextText('Upload your agency logo (recommended size: 200x200px)', 'Upload your profile photo (recommended size: 200x200px)')}
                                    </p>
                                    <button
                                        onClick={() => document.getElementById('logoUpload')?.click()}
                                        className="px-3 py-1.5 border rounded-md bg-white text-gray-900 border-gray-300 hover:bg-gray-50 text-sm inline-flex items-center transition-colors"
                                    >
                                        <Upload className="w-4 h-4 mr-2" /> Upload Logo
                                    </button>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="agency_name" className="block text-sm font-medium text-gray-900">
                                        {getContextText('Agency Name', 'Guide Name')} *
                                    </label>
                                    <input
                                        id="agency_name"
                                        placeholder={getContextText('Enter agency name', 'Enter your name')}
                                        value={formData.agency_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="agencyEmail" className="block text-sm font-medium text-gray-900">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            id="agencyEmail"
                                            type="email"
                                            placeholder="contact@agency.com"
                                            value={formData.agency_email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="agencyPhone" className="block text-sm font-medium text-gray-900">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            id="agencyPhone"
                                            type="tel"
                                            placeholder="+213 XX XXX XXXX"
                                            value={formData.agency_phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="agencyWebsite" className="block text-sm font-medium text-gray-900">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            id="agencyWebsite"
                                            type="url"
                                            placeholder="https://www.agency.com"
                                            value={formData.agency_website}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                    {getContextText('Agency Description', 'About You')} *
                                </label>
                                <textarea
                                    id="description"
                                    placeholder={getContextText('Tell travelers about your agency, your experience, and what makes you special...', 'Tell travelers about yourself, your experience, and what makes you special...')}
                                    rows={6}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Minimum 100 characters ({formData.description.length}/500)
                                </p>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                                    Main Office Location *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        id="location"
                                        placeholder="City, Region"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Service Locations Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Locations</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Select the regions where you offer tour services
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {availableLocations.map((location) => (
                                <button
                                    key={location}
                                    onClick={() => toggleLocation(location)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedLocations.includes(location)
                                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {location}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Contact & Support Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact & Support Information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-900">
                                        Emergency Contact
                                    </label>
                                    <input
                                        id="emergency_phone"
                                        type="tel"
                                        placeholder="+213 XX XXX XXXX"
                                        value={formData.emergency_phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="support_email" className="block text-sm font-medium text-gray-900">
                                        Support Email
                                    </label>
                                    <input
                                        id="support_email"
                                        type="email"
                                        placeholder="support@agency.com"
                                        value={formData.support_email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="working_hours" className="block text-sm font-medium text-gray-900">
                                    Working Hours
                                </label>
                                <input
                                    id="working_hours"
                                    placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                                    value={formData.working_hours}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-end gap-4"
                >
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
