import { Bell, Save } from "lucide-react";

interface NotificationSettingsProps {
    settings: {
        emailNotifications: boolean;
        bookingAlerts: boolean;
        reviewAlerts: boolean;
        promotionalEmails: boolean;
        weeklyReport: boolean;
    };
    onSettingsChange: (field: string, value: any) => void;
    onSave: () => void;
}

export function NotificationSettings({
    settings,
    onSettingsChange,
    onSave
}: NotificationSettingsProps) {
    const notificationOptions = [
        { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
        { key: "bookingAlerts", label: "Booking Alerts", description: "Get notified for new bookings" },
        { key: "reviewAlerts", label: "Review Alerts", description: "Get notified for new reviews" },
        { key: "promotionalEmails", label: "Promotional Emails", description: "Receive updates and promotions" },
        { key: "weeklyReport", label: "Weekly Report", description: "Receive weekly performance reports" },
    ];

    return (
        <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
            </h2>

            <div className="space-y-4">
                {notificationOptions.map((option) => (
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-soft0"></div>
                        </label>
                    </div>
                ))}
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
                    Save Preferences
                </button>
            </div>
        </div>
    );
} 