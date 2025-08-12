function Purchase() {
  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t-2 border-[#88918B4D] items-center pl-5">
      <div className="min-w-[80px] text-[16px] font-normal ">TRX000</div>
      <div className="flex items-center gap-3 min-w-[100px] text-[16px]">
        May 15, 2025
      </div>
      <div className="ml-5 min-w-[120px] text-[16px]">XYZ Suppliers</div>
      <div className="font-normal text-[16px]  ml-3 min-w-[100px] ">
        Nivea Lotion
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[70px] ">100</div>
      <div className="font-medium text-[16px] text-secondary-custom min-w-[80px]">
        N5.00
      </div>
      <div className="text-[16px] font-medium   min-w-[90px]">N500.00</div>
      <div className="text-[16px] font-medium text-others-normal-green  w-fit h-fit min-w-[120px]">
        Bank Transfer
      </div>
      <div className=" text-primary-custom  text-[12px] h-fit min-w-[60px]">
        <button className="bg-[#E5E5E54D] px-2 mr-1  rounded-[16px] ">
          Edit
        </button>
        <button className="bg-[#DA1515] text-white px-2  rounded-[16px] ">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Purchase;
