// Tabs component for dashboard navigation
'use client';


type TabKey = 'Overview' | 'Projects' | 'Settings' | 'Users' | 'Roles';
interface TabsProps {
  tabs: TabKey[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-2 text-lg ${
              activeTab === tab
                ? 'text-[#4B9CD3] border-b-2 border-[#4B9CD3]'
                : 'text-[#2F4F4F] hover:text-[#4B9CD3]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}
