import { useState } from "react";
import { capitalizeFirst, formatCurrency } from "../../utils/helpers";
import type { ProductTypes } from "../../utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddProduct from "./AddProduct";
import DeleteModal from "../../ui/DeleteModal";
import { useDeleteProduct } from "../../customHooks/useProducts";

type ProductProps = {
  product: ProductTypes;
};

function Product({ product }: ProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteProduct, isDeletingProduct } = useDeleteProduct();
  // console.log(product);

  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t-2 border-[#88918B4D] items-center pl-5">
      <div className="min-w-[100px] text-[16px] font-normal  max-w-[100px]">
        {product.barcode}
      </div>
      <div className="flex items-center gap-3 min-w-[133px] text-[16px] max-w-[133px]">
        {product.name}
      </div>
      <div className="ml-5 min-w-[100px] text-[16px] max-w-[100px]">
        {product.category?.name}
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[100px] ">
        {capitalizeFirst(product.product_type)}
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[90px] ">
        {product.stock}
      </div>
      <div className="font-medium text-[12px] text-secondary-custom min-w-[130px]">
        {formatCurrency(product.unit_purchase_price)}
      </div>
      <div className="text-[12px] font-medium text-others-normal-green  w-fit h-fit min-w-[90px]">
        {formatCurrency(product.unit_selling_price)}
      </div>
      <div className=" text-primary-custom  text-[12px] h-fit min-w-[60px]">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className="bg-[#E5E5E54D] px-2 mr-1  rounded-[16px] cursor-pointer"
            role="button"
          >
            Edit
          </DialogTrigger>
          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <AddProduct setIsOpen={setIsOpen} product={product} />
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
              onDelete={deleteProduct}
              isDeleting={isDeletingProduct}
              name={product.name}
              id={`${product.id}`}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Product;
