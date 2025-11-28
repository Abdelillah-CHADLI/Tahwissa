import { User, Mail, Phone, Calendar, Users, MessageCircle, CheckCircle } from "lucide-react";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfPeople: string;
    date: string;
    specialRequests: string;
}

interface ConfirmationStepProps {
    formData: FormData;
    onBack: () => void;
    onConfirm: () => void;
}

export function ConfirmationStep({ formData, onBack, onConfirm }: ConfirmationStepProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {formData.firstName} {formData.lastName}
                    </p>
                    <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {formData.email}
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {formData.phone}
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
                <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Date: {formData.date}
                    </p>
                    <p className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        People: {formData.numberOfPeople}
                    </p>
                    {formData.specialRequests && (
                        <p className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-500" />
                            Requests: {formData.specialRequests}
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 text-sm">
                        By confirming, you agree to the cancellation policy and terms of service
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                >
                    Back
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}