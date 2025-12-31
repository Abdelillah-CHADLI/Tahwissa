import { useState } from 'react';
interface PaymentFormProps {
    onBack: () => void;
    onNext: () => void;
}

interface PaymentErrors {
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    cvv?: string;
}

export function PaymentForm({ onBack, onNext }: PaymentFormProps) {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: '',
    });
    const [errors, setErrors] = useState<PaymentErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateCardNumber = (cardNumber: string): string | undefined => {
        if (!cardNumber) return 'Card number is required';
        const cleaned = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleaned)) return 'Card number must be 16 digits';
        return undefined;
    };

    const validateCardholderName = (name: string): string | undefined => {
        if (!name.trim()) return 'Cardholder name is required';
        if (name.length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters';
        return undefined;
    };

    const validateExpiryDate = (expiry: string): string | undefined => {
        if (!expiry) return 'Expiry date is required';
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Format must be MM/YY';

        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) return 'Invalid month';

        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return 'Card has expired';
        }

        return undefined;
    };

    const validateCVV = (cvv: string): string | undefined => {
        if (!cvv) return 'CVV is required';
        if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
        return undefined;
    };

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'cardNumber':
                return validateCardNumber(value);
            case 'cardholderName':
                return validateCardholderName(value);
            case 'expiryDate':
                return validateExpiryDate(value);
            case 'cvv':
                return validateCVV(value);
            default:
                return undefined;
        }
    };

    const formatCardNumber = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 16);
        return limited.replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiryDate = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        if (name === 'cardNumber') {
            value = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            value = formatExpiryDate(value);
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData({ ...formData, [name]: value });

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({ ...errors, [name]: error });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = () => {
        const newErrors: PaymentErrors = {
            cardNumber: validateCardNumber(formData.cardNumber),
            cardholderName: validateCardholderName(formData.cardholderName),
            expiryDate: validateExpiryDate(formData.expiryDate),
            cvv: validateCVV(formData.cvv),
        };

        setTouched({
            cardNumber: true,
            cardholderName: true,
            expiryDate: true,
            cvv: true,
        });

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== undefined);

        if (!hasErrors) {
            onNext();
        }
    };

    const isFormValid =
        formData.cardNumber &&
        formData.cardholderName &&
        formData.expiryDate &&
        formData.cvv &&
        !errors.cardNumber &&
        !errors.cardholderName &&
        !errors.expiryDate &&
        !errors.cvv;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                </label>
                <input
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.cardNumber && errors.cardNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {touched.cardNumber && errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                </label>
                <input
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Name on card"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.cardholderName && errors.cardholderName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                />
                {touched.cardholderName && errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                    </label>
                    <input
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.expiryDate && errors.expiryDate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                            }`}
                    />
                    {touched.expiryDate && errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                    </label>
                    <input
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.cvv && errors.cvv
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                            }`}
                    />
                    {touched.cvv && errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                    )}
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
                    onClick={handleSubmit}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${isFormValid
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                >
                    Review Booking
                </button>
            </div>
        </div>
    );
}