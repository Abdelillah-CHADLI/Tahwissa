type Tab = {
    id: string;
    label: string;
}

type TabsNavigationProps = {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

function TabsNavigation({ tabs, activeTab, onTabChange }: TabsNavigationProps) {
    return (
        <div className="border-b mb-6">
            <div className="flex gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pb-2 px-1 ${activeTab === tab.id
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-600"
                            }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default TabsNavigation;