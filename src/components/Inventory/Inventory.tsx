import { useState } from "react";
import type { InventoryTypes } from "../../utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddInventory from "./AddInventory";

interface InventoryProps {
  inventory: InventoryTypes;
}

function Inventory({ inventory }: InventoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  // console.log(inventory);

  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t border-[#88918B4D] items-center pl-5">
      <div className="min-w-[193px] text-[16px] font-normal flex items-center gap-3 max-w-[193px]">
        {inventory.name}
      </div>
      <div className="flex items-center gap-3 min-w-[133px] text-[16px]">
        {inventory.stock}
      </div>
      <div className="ml-5 min-w-[180px] text-[16px]">
        {inventory.status === "in stock" && (
          <p className="bg-[#08AA0833] text-[#08AA08] w-fit px-2 py-1   rounded-full">
            In Stock
          </p>
        )}
        {inventory.status === "out of stock" && (
          <p className="bg-[#88918B4D] text-[#88918B] w-fit px-2 py-1   rounded-full">
            Out of Stock
          </p>
        )}
      </div>
      <div className="font-normal text-[16px] text-[#5c5c5c] ml-3 min-w-[147px] max-w-[147px]">
        {inventory.description}
      </div>
      <div className=" text-primary-custom  text-[12px] h-fit min-w-[60px] flex items-center justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className="bg-[#E5E5E54D] px-2 mr-1  rounded-[16px] cursor-pointer"
            role="button"
          >
            Add Quantity
          </DialogTrigger>
          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Edit Inventory</DialogTitle>
            </DialogHeader>
            <AddInventory inventory={inventory} setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Inventory;
