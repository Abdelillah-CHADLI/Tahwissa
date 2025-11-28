interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfPeople: string;
    date: string;
    specialRequests: string;
}

interface BookingDetailsFormProps {
    formData: FormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
}

export function BookingDetailsForm({ formData, onChange, onNext }: BookingDetailsFormProps) {
    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.date;

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
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                    </label>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
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
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                </label>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                    </label>
                    <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of People *
                    </label>
                    <input
                        name="numberOfPeople"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.numberOfPeople}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                </label>
                <input
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requirements..."
                />
            </div>

            <button
                onClick={onNext}
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-md font-medium ${isFormValid
                        ? "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
            >
                Continue to Payment
            </button>
        </div>
    );
}