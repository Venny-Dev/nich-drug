import { useState } from "react";
import { capitalizeFirst } from "../../utils/helpers";
import type { ShopTypes } from "../../utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddShop from "./AddShop";
import { useDeleteShop } from "../../customHooks/useShop";
import DeleteModal from "../../ui/DeleteModal";

interface ShopProps {
  shop: ShopTypes;
}

function Shop({ shop }: ShopProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteShop, isDeletingShop } = useDeleteShop();

  // console.log(shop);
  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t border-[#88918B4D] items-center pl-5">
      <div className="min-w-[193px] text-[16px] font-normal ">
        {capitalizeFirst(shop.name)}
      </div>
      <div className="flex items-center gap-3 min-w-[133px] text-[16px] text-wrap max-w-[113px]">
        {`${capitalizeFirst(shop.address)}, ${shop.city}, ${shop.state}`}
      </div>
      <div className="ml-5 min-w-[220px] text-[16px]">admin@nichdrugs.com</div>
      <div className="ml-5 min-w-[200px] text-[16px] max-w-[200px]">
        {shop.description}
      </div>
      <div className="font-normal text-[16px] text-[#5c5c5c] ml-3 min-w-[80px] ">
        {shop.products_count}
      </div>
      <div className="font-medium text-[12px] text-secondary-custom min-w-[108px]">
        <p className="bg-[#08AA0833] text-[#08AA08] w-fit px-2 py-1   rounded-full">
          Active
        </p>
      </div>
      <div className=" text-primary-custom  text-[12px] h-fit min-w-[90px]">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className="bg-[#E5E5E54D] px-2 mr-1  rounded-[16px] cursor-pointer"
            role="button"
          >
            Edit
          </DialogTrigger>
          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Edit Shop</DialogTitle>
            </DialogHeader>
            <AddShop setIsOpen={setIsOpen} shop={shop} />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger
            className="bg-[#DA1515] text-white px-2  rounded-[16px] cursor-pointer"
            role="button"
          >
            Delete
          </DialogTrigger>
          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Delete</DialogTitle>
            </DialogHeader>
            <DeleteModal
              setIsOpen={setIsDeleteOpen}
              onDelete={deleteShop}
              isDeleting={isDeletingShop}
              name={shop.name}
              id={shop.id}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Shop;
