import { OfferCard } from './OfferCard';
import { getContextText } from '../../../utils/userContext';

interface OffersGridProps {
    onSelectPlan: (planId: number) => void;
    selectedPlan: number | null;
    onGetStarted: () => void;
}

export function OffersGrid({ onSelectPlan, selectedPlan, onGetStarted }: OffersGridProps) {
    const offers = [
        {
            id: 1,
            name: "Starter Boost",
            tagline: getContextText('Perfect for new agencies', 'Perfect for new guides'),
            price: "4,900 DZD",
            period: "/month",
            popular: false,
            color: "from-blue-500 to-blue-600",
            features: [
                "Featured listing on homepage",
                "Up to 10 tour listings",
                "Basic analytics dashboard",
                "Email support",
                "Profile badge",
                "Priority in search results",
            ],
        },
        {
            id: 2,
            name: "Professional",
            tagline: "Most popular choice",
            price: "9,900 DZD",
            period: "/month",
            popular: true,
            color: "from-yellow-500 to-yellow-600",
            features: [
                "Everything in Starter Boost",
                "Unlimited tour listings",
                "Advanced analytics & insights",
                "24/7 Priority support",
                "Premium profile badge",
                "Top placement in all searches",
                "Social media promotion",
                "Monthly performance reports",
                "Featured in newsletter",
            ],
        },
        {
            id: 3,
            name: "Enterprise",
            tagline: getContextText('For established agencies', 'For established guides'),
            price: "19,900 DZD",
            period: "/month",
            popular: false,
            color: "from-purple-500 to-purple-600",
            features: [
                "Everything in Professional",
                "Dedicated account manager",
                "Custom branding options",
                "API access for integrations",
                "White-label booking system",
                "Advanced SEO optimization",
                "Exclusive partnership opportunities",
                "Custom marketing campaigns",
                "Quarterly business reviews",
            ],
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
                <div key={offer.id} className={offer.popular ? "md:-mt-4" : ""}>
                    <OfferCard
                        offer={offer}
                        onSelect={() => onSelectPlan(offer.id)}
                        selected={selectedPlan === offer.id}
                        onGetStarted={onGetStarted}
                    />
                </div>
            ))}
        </div>
    );
}