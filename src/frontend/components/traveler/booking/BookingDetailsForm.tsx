import { useState } from 'react';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface BookingDetailsFormProps {
    formData: FormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
}

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export function BookingDetailsForm({ formData, onChange, onNext }: BookingDetailsFormProps) {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateName = (name: string, field: string): string | undefined => {
        if (!name.trim()) return `${field} is required`;
        if (name.length < 2) return `${field} must be at least 2 characters`;
        if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${field} can only contain letters`;
        return undefined;
    };

    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return undefined;
    };

    const validatePhone = (phone: string): string | undefined => {
        if (!phone.trim()) return 'Phone number is required';
        // Algerian phone formats: +213XXXXXXXXX or 0XXXXXXXXX 
        const algerianPhone = /^(\+213|0)[5-7][0-9]{8}$/;
        const cleaned = phone.replace(/[\s-]/g, '');
        if (!algerianPhone.test(cleaned)) {
            return 'Please enter a valid Algerian phone number (e.g., +213XXXXXXXXX or 0XXXXXXXXX)';
        }
        return undefined;
    };

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'firstName':
                return validateName(value, 'First name');
            case 'lastName':
                return validateName(value, 'Last name');
            case 'email':
                return validateEmail(value);
            case 'phone':
                return validatePhone(value);
            default:
                return undefined;
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (touched[e.target.name]) {
            const error = validateField(e.target.name, e.target.value);
            setErrors({ ...errors, [e.target.name]: error });
        }
    };

    const handleSubmit = () => {
        const newErrors: ValidationErrors = {
            firstName: validateName(formData.firstName, 'First name'),
            lastName: validateName(formData.lastName, 'Last name'),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
        };

        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        });

        setErrors(newErrors);


        const hasErrors = Object.values(newErrors).some(error => error !== undefined);

        if (!hasErrors) {
            onNext();
        }
    };

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        !errors.firstName &&
        !errors.lastName &&
        !errors.email &&
        !errors.phone;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                    </label>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.firstName && errors.firstName
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        placeholder="Enter your first name"
                    />
                    {touched.firstName && errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.lastName && errors.lastName
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        placeholder="Enter your last name"
                    />
                    {touched.lastName && errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                </label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="example@email.com"
                />
                {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                </label>
                <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${touched.phone && errors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="+213 XXX XXX XXX or 0XXX XXX XXX"
                />
                {touched.phone && errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
            >
                Continue to Payment
            </button>
        </div>
    );
}