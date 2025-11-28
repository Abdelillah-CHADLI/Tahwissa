interface ProgressStepsProps {
    step: number;
}

export function ProgressSteps({ step }: ProgressStepsProps) {
    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                <span>1</span>
                <span className="hidden sm:inline">Details</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                <span>2</span>
                <span className="hidden sm:inline">Payment</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                <span>3</span>
                <span className="hidden sm:inline">Confirm</span>
            </div>
        </div>
    );
}