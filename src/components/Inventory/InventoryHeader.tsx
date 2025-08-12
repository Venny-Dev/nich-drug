function InventoryHeader() {
  return (
    <div className="flex justify-between  items-center">
      <h1 className="font-bold text-[16px]">Inventory</h1>
      <div className="space-x-[11px]">
        <button className="bg-[#37589F99] p-3 text-white rounded-[8px]">
          Export
        </button>
      </div>
    </div>
  );
}

export default InventoryHeader;
