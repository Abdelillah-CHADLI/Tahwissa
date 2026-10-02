import { Shield, CheckCircle } from "lucide-react";
import { getContextText } from "../../utils/userContext";

interface VerificationBannerProps {
    verified: boolean;
    onApplyVerification: () => void;
}

export function VerificationBanner({ verified, onApplyVerification }: VerificationBannerProps) {
    if (verified) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                    <h3 className="font-semibold text-green-900">{getContextText('Verified Agency', 'Verified Guide')}</h3>
                    <p className="text-sm text-green-700">{getContextText('Your agency has been verified', 'Your profile has been verified')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-soft border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-brand" />
            <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Get Verified</h3>
                <p className="text-sm text-brand-dark">{getContextText('Increase trust with travelers by verifying your agency', 'Increase trust with travelers by verifying your profile')}</p>
            </div>
            <button
                onClick={onApplyVerification}
                className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
            >
                Apply Now
            </button>
        </div>
    );
}
