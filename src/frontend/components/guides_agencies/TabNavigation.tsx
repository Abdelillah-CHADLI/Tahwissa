export default function TabNavigation({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return <div className="segmented-tabs mt-6" aria-label="Provider type">
    <button type="button" className="segmented-tab" aria-pressed={activeTab === 'agencies'} onClick={() => setActiveTab('agencies')}>Travel agencies</button>
    <button type="button" className="segmented-tab" aria-pressed={activeTab === 'guides'} onClick={() => setActiveTab('guides')}>Local guides</button>
  </div>;
}
