import { PremiumHeader } from '../../components/agency/premium/PremiumHeader';
import { OffersGrid } from '../../components/agency/premium/OffersGrid';
import { BenefitsSection } from '../../components/agency/premium/BenefitsSection';
import { FAQSection } from '../../components/agency/premium/FAQSection';

import { useState } from 'react';

export function PremiumOffersPage() {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const handleSelectPlan = (planId: number) => {
        setSelectedPlan(planId);
    };
    const handleGetStarted = () => {
        // to be implemented
        console.log(`Getting started with plan: ${selectedPlan}`);
        alert(`Getting started with plan: ${selectedPlan}`);
    };

    return (
        <div className="p-6 space-y-12">
            {/* Header */}
            <PremiumHeader />

            {/* Offers Cards */}
            <OffersGrid
                onSelectPlan={handleSelectPlan}
                selectedPlan={selectedPlan}
                onGetStarted={handleGetStarted}
            />

            {/* Benefits Section */}
            <BenefitsSection />

            {/* FAQ Section */}
            <FAQSection />
        </div>
    );
}