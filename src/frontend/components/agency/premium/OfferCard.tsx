import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react';

interface OfferCardProps {
    offer: {
        id: number;
        name: string;
        tagline: string;
        price: string;
        period: string;
        popular: boolean;
        color: string;
        features: string[];
    };
    onSelect: () => void;
    selected?: boolean;
    onGetStarted: () => void;
}

export function OfferCard({ offer, onSelect, selected, onGetStarted }: OfferCardProps) {
    const getIcon = () => {
        switch (offer.name) {
            case 'Starter Boost': return Zap;
            case 'Professional': return Star;
            case 'Enterprise': return Crown;
            default: return Star;
        }
    };

    const Icon = getIcon();

    return (
        <div
            className={`bg-white rounded-xl border-2 p-6 h-full relative transition-all duration-150 cursor-pointer 
                ${selected ? 'border-[#4A7B7B] shadow-lg' : 'border-gray-200 hover:border-[#4A7B7B]/50'}
                hover:shadow-xl hover:scale-[1.03] active:scale-95`}
            onClick={onSelect}
        >
            {/* Popular Badge */}
            {offer.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className={`bg-[#4A7B7B] text-white  px-4 py-1 rounded-full text-xs font-medium shadow-md`}>
                        Most Popular
                    </div>
                </div>
            )}

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selected ? "from-[#4A7B7B] to-[#375E5E]" : offer.color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{offer.name}</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">{offer.tagline}</p>

            {/* Price */}
            <div className="mb-6 text-center">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">{offer.price}</span>
                    <span className="text-gray-500">{offer.period}</span>
                </div>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
                {offer.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Button */}
            <button
                tabIndex={selected ? 0 : -1}
                onClick={selected ? onGetStarted : onSelect}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${selected
                    ? 'bg-[#4A7B7B] text-white hover:bg-[#3A6B6B]'
                    : 'bg-[#c3e87b] text-[#375E5E] hover:bg-[#D4F58D]'
                    }`}
                style={{ pointerEvents: selected ? 'auto' : 'none' }}
            >
                Get Started
                <ArrowRight className="w-4 h-4" />
            </button>
        </div >
    );
}