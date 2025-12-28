import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { SettingsTabs } from "../../components/agency/settings/SettingsTabs";
import { AccountSettings } from "../../components/agency/settings/AccountSettings";
import { NotificationSettings } from "../../components/agency/settings/NotificationSettings";
import { PaymentSettings } from "../../components/agency/settings/PaymentSettings";
import { PrivacySettings } from "../../components/agency/settings/PrivacySettings";
import { settingsService } from "../../services/api";
import { getCurrentAgencyId } from "../../utils/session";

interface Settings {
    agencyName: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    emailNotifications: boolean;
    bookingAlerts: boolean;
    reviewAlerts: boolean;
    promotionalEmails: boolean;
    weeklyReport: boolean;
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    swiftCode?: string;
    profileVisibility: boolean;
    showContactInfo: boolean;
    allowReviews: boolean;
}

export function AgencySettings() {
    const [activeTab, setActiveTab] = useState("account");
    const [settings, setSettings] = useState<Settings>({
        agencyName: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        emailNotifications: true,
        bookingAlerts: true,
        reviewAlerts: true,
        promotionalEmails: false,
        weeklyReport: true,
        accountHolder: "",
        bankName: "",
        accountNumber: "",
        swiftCode: "",
        profileVisibility: true,
        showContactInfo: true,
        allowReviews: true,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const getAgencyId = () => getCurrentAgencyId();

    // --- API Calls ---
    const fetchAllSettings = async () => {
        try {
            setLoading(true);
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            const accountResponse = await settingsService.getAccountSettings(agencyId);
            const notificationResponse = await settingsService.getNotificationSettings(agencyId);
            const paymentResponse = await settingsService.getPaymentSettings(agencyId);
            const privacyResponse = await settingsService.getPrivacySettings(agencyId);

            setSettings(prev => ({
                ...prev,
                agencyName: accountResponse.data?.agency_name || prev.agencyName,
                email: accountResponse.data?.email || prev.email,
                phone: accountResponse.data?.phone || prev.phone,
                emailNotifications: notificationResponse.data?.email_notifications ?? prev.emailNotifications,
                bookingAlerts: notificationResponse.data?.booking_alerts ?? prev.bookingAlerts,
                reviewAlerts: notificationResponse.data?.review_alerts ?? prev.reviewAlerts,
                promotionalEmails: notificationResponse.data?.promotional_emails ?? prev.promotionalEmails,
                weeklyReport: notificationResponse.data?.weekly_report ?? prev.weeklyReport,
                accountHolder: paymentResponse.data?.account_holder || prev.accountHolder,
                bankName: paymentResponse.data?.bank_name || prev.bankName,
                accountNumber: paymentResponse.data?.account_number || prev.accountNumber,
                swiftCode: paymentResponse.data?.swift_code || prev.swiftCode,
                profileVisibility: privacyResponse.data?.profile_visibility ?? prev.profileVisibility,
                showContactInfo: privacyResponse.data?.show_contact_info ?? prev.showContactInfo,
                allowReviews: privacyResponse.data?.allow_reviews ?? prev.allowReviews,
            }));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load settings";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAccount = async () => {
        try {
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            await settingsService.updateAccountSettings(agencyId, {
                agency_name: settings.agencyName,
                email: settings.email,
                phone: settings.phone
            });

            showSuccessMessage("Account settings saved successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save account settings";
            setError(errorMessage);
        }
    };

    const handleChangePassword = async () => {
        if (settings.newPassword !== settings.confirmPassword) {
            setError("New password and confirmation do not match!");
            return;
        }

        if (settings.newPassword.length < 8) {
            setError("Password must be at least 8 characters long!");
            return;
        }

        try {
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            await settingsService.changePassword(agencyId, {
                current_password: settings.currentPassword,
                new_password: settings.newPassword
            });

            setSettings(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));

            showSuccessMessage("Password changed successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to change password";
            setError(errorMessage);
        }
    };

    const handleSaveNotifications = async () => {
        try {
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            await settingsService.updateNotificationSettings(agencyId, {
                email_notifications: settings.emailNotifications,
                booking_alerts: settings.bookingAlerts,
                review_alerts: settings.reviewAlerts,
                promotional_emails: settings.promotionalEmails,
                weekly_report: settings.weeklyReport
            });

            showSuccessMessage("Notification settings saved successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save notification settings";
            setError(errorMessage);
        }
    };

    const handleSavePayment = async () => {
        try {
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            await settingsService.updatePaymentSettings(agencyId, {
                account_holder: settings.accountHolder,
                bank_name: settings.bankName,
                account_number: settings.accountNumber,
                swift_code: settings.swiftCode
            });

            showSuccessMessage("Payment settings saved successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save payment settings";
            setError(errorMessage);
        }
    };

    const handleSavePrivacy = async () => {
        try {
            setError(null);

            const agencyId = getAgencyId();
            if (!agencyId) {
                setError("Agency ID not found. Please log in.");
                return;
            }

            await settingsService.updatePrivacySettings(agencyId, {
                profile_visibility: settings.profileVisibility,
                show_contact_info: settings.showContactInfo,
                allow_reviews: settings.allowReviews
            });

            showSuccessMessage("Privacy settings saved successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to save privacy settings";
            setError(errorMessage);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchAllSettings();
    }, []);

    // --- Handlers ---
    const handleInputChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        if (success) setSuccess(null);
    };

    const showSuccessMessage = (message: string) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-lg text-gray-600">Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-red-800 font-semibold">Error</div>
                        <div className="text-red-600 mt-1">{error}</div>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800"
                    >
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-green-800 font-semibold">Success</div>
                        <div className="text-green-600 mt-1">{success}</div>
                    </div>
                </div>
            )}

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