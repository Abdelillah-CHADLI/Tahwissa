import { Shield, Save } from "lucide-react";

interface PrivacySettingsProps {
    settings: {
        profileVisibility: boolean;
        showContactInfo: boolean;
        allowReviews: boolean;
    };
    onSettingsChange: (field: string, value: any) => void;
    onSave: () => void;
}

export function PrivacySettings({
    settings,
    onSettingsChange,
    onSave
}: PrivacySettingsProps) {
    const privacyOptions = [
        { key: "profileVisibility", label: "Profile Visibility", description: "Make agency profile visible" },
        { key: "showContactInfo", label: "Show Contact Info", description: "Display email and phone publicly" },
        { key: "allowReviews", label: "Allow Reviews", description: "Let travelers leave reviews" },
    ];

    return (
        <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
            </h2>

            <div className="space-y-4">
                {privacyOptions.map((option) => (
                    <div key={option.key} className="flex items-center justify-between py-3 border-b">
                        <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings[option.key as keyof typeof settings] as boolean}
                                onChange={(e) => onSettingsChange(option.key, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="border-t mt-6 pt-6">
                <h3 className="font-medium mb-4">Data Management</h3>
                <div className="space-y-3">
                    <button className="w-full border border-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
                        <Shield className="w-4 h-4" />
                        Download My Data
                    </button>
                    <button className="w-full border border-red-300 text-red-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-red-50">
                        <Shield className="w-4 h-4" />
                        Delete Account
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Deleting your account will permanently remove all your data.
                </p>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                >
                    <Save className="w-4 h-4" />
                    Save Privacy Settings
                </button>
            </div>
        </div>
    );
}
