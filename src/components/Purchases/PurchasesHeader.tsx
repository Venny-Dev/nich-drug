import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddPurchase from "./AddPurchase";

function PurchasesHeader() {
  return (
    <>
      <div className="flex justify-between  items-center">
        <h1 className="font-bold text-[16px]">Purchases</h1>
        <div className="space-x-[11px]">
          <Dialog>
            <DialogTrigger
              className="bg-[#37589F99] p-3 text-white rounded-[8px] cursor-pointer"
              role="button"
            >
              + Add
            </DialogTrigger>
            <DialogContent className="bg-white border-none max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Add New Inventory</DialogTitle>
              </DialogHeader>
              <AddPurchase />
            </DialogContent>
          </Dialog>

          <button className="bg-[#37589F99] p-3 text-white rounded-[8px]">
            Export
          </button>
        </div>
      </div>

      <div className="relative my-6 max-w-[420px]">
        <input
          type="text"
          placeholder="Search by ID, Name"
          className="w-full  bg-white text-[#88918B] py-3 pl-[35px] pr-3 rounded-[8px]  focus:outline-none text-[12px] font-normal"
        />
        <img
          src="/search-icon.png"
          className="absolute top-4 size-3 left-3"
          alt=""
        />
      </div>
    </>
  );
}

export default PurchasesHeader;
