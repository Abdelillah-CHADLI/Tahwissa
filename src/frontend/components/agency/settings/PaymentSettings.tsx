import { CreditCard, Shield, Save } from "lucide-react";

interface PaymentSettingsProps {
    settings: {
        accountHolder: string;
        bankName: string;
        accountNumber: string;
    };
    onSettingsChange: (field: string, value: any) => void;
    onSave: () => void;
}

export function PaymentSettings({
    settings,
    onSettingsChange,
    onSave
}: PaymentSettingsProps) {
    return (
        <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                    <input
                        type="text"
                        value={settings.accountHolder}
                        onChange={(e) => onSettingsChange("accountHolder", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Bank Name</label>
                    <input
                        type="text"
                        value={settings.bankName}
                        onChange={(e) => onSettingsChange("bankName", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <input
                        type="text"
                        value={settings.accountNumber}
                        onChange={(e) => onSettingsChange("accountNumber", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your account number is encrypted and secure</p>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex items-center gap-2 text-brand mb-2">
                    <Shield className="w-5 h-5" />
                    <h4 className="font-medium">Secure Payment Processing</h4>
                </div>
                <p className="text-sm text-gray-600">
                    All payment information is encrypted and securely stored. We never share your financial details.
                </p>
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
                    Save Payment Info
                </button>
            </div>
        </div>
    );
}