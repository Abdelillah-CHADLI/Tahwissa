import { User, Bell, CreditCard, Shield } from "lucide-react";

interface SettingsTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
    const tabs = [
        { id: "account", label: "Account", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "payment", label: "Payment", icon: CreditCard },
        { id: "privacy", label: "Privacy", icon: Shield },
    ];

    return (
        <div className="border-b mb-6">
            <div className="flex gap-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pb-3 px-1 font-medium flex items-center gap-2 ${activeTab === tab.id
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-600"
                            }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}