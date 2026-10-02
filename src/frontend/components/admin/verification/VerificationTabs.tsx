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
        <div className="segmented-tabs">
            <div className="flex min-w-max">
                {tabs.map((tab) => (
                    <button
                        key={tab.id} aria-pressed={activeTab === tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="segmented-tab"
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>
        </div>
    );
}
