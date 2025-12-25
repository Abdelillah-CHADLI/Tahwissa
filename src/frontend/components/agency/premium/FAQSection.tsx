import { useState } from 'react';
import { Mail, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How does payment work?",
            answer: "Payments are processed monthly. You can cancel anytime. We accept credit cards and bank transfers for Algerian agencies."
        },
        {
            question: "Can I change my plan later?",
            answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
        },
        {
            question: "Is there a free trial?",
            answer: "We offer a 14-day free trial for our Professional plan. No credit card required to start the trial."
        },
        {
            question: "What happens if I cancel?",
            answer: "You can cancel anytime. After cancellation, you'll continue to have access until the end of your billing period."
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-6 h-6 text-[#4A7B7B]" />
                <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4 mb-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0">
                        <button
                            className="w-full flex items-center justify-between py-4 text-left"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            <span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-[#4A7B7B]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </span>
                        </button>

                        {openIndex === index && (
                            <div className="pb-4">
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Contact Section */}
            <div className="pt-6 border-t border-gray-200">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Mail className="w-5 h-5 text-[#4A7B7B]" />
                        <h4 className="font-semibold text-gray-900">Still have questions?</h4>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Our team is here to help you choose the right plan for your business
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <button className="px-6 py-2 border border-[#4A7B7B] text-[#4A7B7B] rounded-lg hover:bg-[#4A7B7B]/5 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}