import { NAVIGATION_TABS, type TabType } from "./constants";

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function NavigationTabs({
  activeTab,
  setActiveTab,
}: NavigationTabsProps) {
  return (
    <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-sm border-b border-grey-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex space-x-1 p-2 bg-grey-100 rounded-xl">
            {NAVIGATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-grey-700 hover:text-primary-600 hover:bg-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
