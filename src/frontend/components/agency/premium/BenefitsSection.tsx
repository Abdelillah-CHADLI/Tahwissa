import { TrendingUp } from 'lucide-react';
import { getContextText } from '../../../utils/userContext';

export function BenefitsSection() {
    const benefits = [
        {
            title: "3x More Visibility",
            description: getContextText('Premium agencies get featured placement and appear at the top of search results', 'Premium guides get featured placement and appear at the top of search results'),
            stat: "300%",
        },
        {
            title: "50% More Bookings",
            description: "Premium members report an average 50% increase in booking inquiries",
            stat: "+50%",
        },
        {
            title: "Dedicated Support",
            description: "Get priority assistance from our team to help you succeed",
            stat: "24/7",
        },
    ];

    return (
        <div className="mt-16">
            <div className="border-2 border-[#4A7B7B]/20 bg-gradient-to-br from-[#4A7B7B]/5 to-[#375E5E]/5 rounded-xl">
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-[#4A7B7B]" />
                        <h3 className="text-xl font-bold text-gray-900">Why Go Premium?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-3 bg-gradient-to-br from-[#4A7B7B] to-[#375E5E] bg-clip-text text-transparent">
                                    {benefit.stat}
                                </div>
                                <h4 className="mb-2 text-lg font-semibold text-gray-900">{benefit.title}</h4>
                                <p className="text-sm text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}