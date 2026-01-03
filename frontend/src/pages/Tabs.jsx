export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
              activeTab === tab.name
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}