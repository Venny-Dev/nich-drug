import { Plus, X } from "lucide-react";
import { usePosTerminalContext } from "../../contexts/PosTerminalContext";

function TabNavigation() {
  const { tabs, activeTabId, setActiveTabId, addNewTab, deleteTab, isLoading } =
    usePosTerminalContext();

  // console.log(tabs);

  return (
    <div className=" mb-6 md:mb-0 lg:max-w-[700px]">
      <div className="flex flex-wrap gap-2">
        {isLoading && (
          <div className="bg-gray-100 md:bg-white md:border text-gray-700 hover:bg-gray-200 ">
            Loading...
          </div>
        )}
        {!isLoading &&
          tabs &&
          Array.isArray(tabs) &&
          tabs.map((tab: any, index: any) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-2  rounded-md  cursor-pointer transition-colors ${
                activeTabId === tab.id
                  ? "bg-[#37589F99] text-white "
                  : "bg-gray-100 md:bg-white md:border text-gray-700 hover:bg-gray-200 "
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="font-medium py-[11px] text-[12px] ">
                {tab.name} {index + 1}
              </span>
              {tab.cart.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ">
                  {tab.cart.reduce(
                    (sum: any, item: any) => sum + item.quantity,
                    0
                  )}
                </span>
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tab.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors border-l h-full pl-2"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        <button
          onClick={addNewTab}
          className="flex items-center gap-1 px-3 py-[11px] bg-white rounded-md md:border transition-colors text-sm"
        >
          <Plus size={16} className="text-black" />
        </button>
      </div>
    </div>
  );
}

export default TabNavigation;
