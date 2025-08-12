import Purchase from "./Purchase";

function PurchasesContainer() {
  return (
    <div className="bg-white overflow-x-auto rounded-[24px] border border-[#E4E4E4]">
      <div className="min-w-max lg:min-w-0">
        <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px]">
            ID
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[80px]">
            Date
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[120px] ml-5">
            Supplier
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px] ml-3">
            Product Name
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[70px]">
            Quantity
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
            Unit Price
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
            Amount
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[138px]">
            Payment Method
          </p>
          <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
            Action
          </p>
        </div>

        {/* Content */}
        <div className="w-full">
          <Purchase />
          <Purchase />
          <Purchase />
          <Purchase />
          <Purchase />
        </div>
      </div>
    </div>
  );
}

export default PurchasesContainer;
