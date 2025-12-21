type TabType = 'pending' | 'approved' | 'rejected';

interface VerificationTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    counts: {
        pending: number;
        approved: number;
        rejected: number;
    };
}

export function VerificationTabs({ activeTab, onTabChange, counts }: VerificationTabsProps) {
    const tabs = [
        { id: 'pending' as TabType, label: 'Pending', count: counts.pending },
        { id: 'approved' as TabType, label: 'Approved', count: counts.approved },
        { id: 'rejected' as TabType, label: 'Rejected', count: counts.rejected }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors
                            ${activeTab === tab.id
                                ? 'text-gray-900 border-b-2 border-teal-600 bg-gray-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>
        </div>
    );
}
