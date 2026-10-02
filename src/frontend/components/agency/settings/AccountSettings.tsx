import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";

interface AccountSettingsProps {
    settings: {
        agencyName: string;
        email: string;
        phone: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    onSettingsChange: (field: string, value: any) => void;
    onSave: () => void;
    onChangePassword: () => void;
}

export function AccountSettings({
    settings,
    onSettingsChange,
    onSave,
    onChangePassword
}: AccountSettingsProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    return (
        <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Agency Name</label>
                    <input
                        type="text"
                        value={settings.agencyName}
                        onChange={(e) => onSettingsChange("agencyName", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => onSettingsChange("email", e.target.value)}
                                className="w-full border rounded px-3 py-2 pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => onSettingsChange("phone", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={settings.currentPassword}
                                onChange={(e) => onSettingsChange("currentPassword", e.target.value)}
                                className="w-full border rounded px-3 py-2 pl-10 pr-10"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={settings.newPassword}
                                    onChange={(e) => onSettingsChange("newPassword", e.target.value)}
                                    className="w-full border rounded px-3 py-2 pl-10 pr-10"
                                />
                                <button
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={settings.confirmPassword}
                                    onChange={(e) => onSettingsChange("confirmPassword", e.target.value)}
                                    className="w-full border rounded px-3 py-2 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onChangePassword}
                        className="border border-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50"
                    >
                        <Lock className="w-4 h-4" />
                        Change Password
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="bg-brand-soft0 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-brand"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}