interface Tab {
    id: string;
    label: string;
}

interface TabsNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function TabsNavigation({ tabs, activeTab, onTabChange }: TabsNavigationProps) {
    return (
        <div className="segmented-tabs mb-6">
            <div className="flex min-w-max">
                {tabs.map((tab) => (
                    <button
                        key={tab.id} aria-pressed={activeTab === tab.id}
                        className="segmented-tab"
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}