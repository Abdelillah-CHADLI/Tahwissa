import { useState } from "react";
import PageHeader from "../../components/traveler/requests/PageHeader";
import { SettingsTabs } from "../../components/agency/settings/SettingsTabs";
import { AccountSettings } from "../../components/agency/settings/AccountSettings";
import { NotificationSettings } from "../../components/agency/settings/NotificationSettings";
import { PaymentSettings } from "../../components/agency/settings/PaymentSettings";
import { PrivacySettings } from "../../components/agency/settings/PrivacySettings";

export function AgencySettings() {
    const [activeTab, setActiveTab] = useState("account");
    const [settings, setSettings] = useState({
        agencyName: "Explore Algeria Tours",
        email: "contact@explorealgeriatours.com",
        phone: "+213 555 123 456",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",

        emailNotifications: true,
        bookingAlerts: true,
        reviewAlerts: true,
        promotionalEmails: false,
        weeklyReport: true,

        accountHolder: "Explore Algeria Tours",
        bankName: "BNA - Banque Nationale d'Algérie",
        accountNumber: "****1234",

        profileVisibility: true,
        showContactInfo: true,
        allowReviews: true,
    });

    const handleInputChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveAccount = () => {
        alert("Account settings saved!");
    };

    const handleChangePassword = () => {
        if (settings.newPassword !== settings.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        alert("Password changed!");
    };

    const handleSaveNotifications = () => {
        alert("Notification settings saved!");
    };

    const handleSavePayment = () => {
        alert("Payment settings saved!");
    };

    const handleSavePrivacy = () => {
        alert("Privacy settings saved!");
    };

    return (
        <div className="p-6">
            <PageHeader
                title="Settings"
                description="Manage your agency account settings and preferences"
            />

            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "account" && (
                <AccountSettings
                    settings={settings}
                    onSettingsChange={handleInputChange}
                    onSave={handleSaveAccount}
                    onChangePassword={handleChangePassword}
                />
            )}

            {activeTab === "notifications" && (
                <NotificationSettings
                    settings={settings}
                    onSettingsChange={handleInputChange}
                    onSave={handleSaveNotifications}
                />
            )}

            {activeTab === "payment" && (
                <PaymentSettings
                    settings={settings}
                    onSettingsChange={handleInputChange}
                    onSave={handleSavePayment}
                />
            )}

            {activeTab === "privacy" && (
                <PrivacySettings
                    settings={settings}
                    onSettingsChange={handleInputChange}
                    onSave={handleSavePrivacy}
                />
            )}
        </div>
    );
}