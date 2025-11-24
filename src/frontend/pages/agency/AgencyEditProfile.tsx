import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, Upload, Save } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

export function AgencyEditProfile() {
    // State for form data, easy to connect with backend later
    const [formData, setFormData] = useState({
        agencyName: 'Explore Algeria Tours',
        agencyEmail: 'contact@explorealgeriatours.dz',
        agencyPhone: '+213 23 456 7890',
        agencyWebsite: 'https://www.explorealgeriatours.dz',
        description: 'Explore Algeria Tours is a premier travel agency specializing in authentic Algerian experiences.',
        location: 'Algiers, Algeria',
        emergencyPhone: '+213 23 456 7899',
        supportEmail: 'support@explorealgeriatours.dz',
        workingHours: 'Mon-Sat'
    });

    // State for logo, easy to handle file upload later
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedLocations, setSelectedLocations] = useState([
        'Algiers', 'Oran', 'Constantine', 'Tamanrasset', 'Béjaïa',
        'Tlemcen', 'Annaba', 'Djurdjura'
    ]);

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
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setLogoPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
            // upload to backend here
        }
    };

    const toggleLocation = (location: string) => {
        if (selectedLocations.includes(location)) {
            setSelectedLocations(selectedLocations.filter(l => l !== location));
        } else {
            setSelectedLocations([...selectedLocations, location]);
        }
    };

    const handleSave = () => {
        // Prepare data for backend
        const dataToSend = {
            ...formData,
            serviceLocations: selectedLocations,
            logo: logoPreview // send file or URL
        };
        console.log('Data to send to backend:', dataToSend);
        alert('Profile saved successfully');
        // TODO: Make API call to save data
    };

    const handleCancel = () => {
        // Reset to original
        console.log('Cancel clicked');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Agency Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Agency Information</h2>
                        
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
                                        <Upload className="w-4 h-4"/>
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <h4 className="mb-1 font-medium text-gray-900">Agency Logo</h4>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Upload your agency logo (recommended size: 200x200px)
                                    </p>
                                    <button
                                        onClick={() => document.getElementById('logoUpload')?.click()}
                                        className="px-3 py-1.5 border rounded-md bg-white text-gray-900 border-gray-300 hover:bg-gray-50 text-sm inline-flex items-center transition-colors"
                                    >
                                        <Upload className="w-4 h-4 mr-2"/> Upload Logo
                                    </button>                            
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="agencyName" className="block text-sm font-medium text-gray-900">
                                        Agency Name *
                                    </label>
                                    <input
                                        id="agencyName"
                                        placeholder="Enter agency name"
                                        value={formData.agencyName}
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
                                            value={formData.agencyEmail}
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
                                            value={formData.agencyPhone}
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
                                            value={formData.agencyWebsite}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                    Agency Description *
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Tell travelers about your agency, your experience, and what makes you special..."
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
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedLocations.includes(location)
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
                                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-900">
                                        Emergency Contact
                                    </label>
                                    <input
                                        id="emergencyPhone"
                                        type="tel"
                                        placeholder="+213 XX XXX XXXX"
                                        value={formData.emergencyPhone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-900">
                                        Support Email
                                    </label>
                                    <input
                                        id="supportEmail"
                                        type="email"
                                        placeholder="support@agency.com"
                                        value={formData.supportEmail}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="workingHours" className="block text-sm font-medium text-gray-900">
                                    Working Hours
                                </label>
                                <input
                                    id="workingHours"
                                    placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                                    value={formData.workingHours}
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
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
