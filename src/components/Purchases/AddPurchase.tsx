function AddPurchase() {
  return (
    <div className="flex-1 overflow-y-auto pr-2 h-[500px] md:h-auto">
      <form className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">
              Date Received
            </label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="Enter Shop Name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">Supplier</label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="XYZ Supplier"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">Product</label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="Nevia Lotion"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">Quantity</label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">Amount</label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="N500.00"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">
              Payment Method
            </label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="Transfer"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Shop</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter Address"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPurchase;
