import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import AddProduct from "./AddProduct";
import { useExportProducts } from "../../customHooks/useExports";
function ProductsHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { exportProducts, isExportingProducts } = useExportProducts();
  return (
    <>
      <div className="flex justify-between  items-center">
        <h1 className="font-bold text-[16px]">Products</h1>
        <div className="space-x-[11px]">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              className="bg-[#37589F99] p-3 text-white rounded-[8px] cursor-pointer"
              role="button"
            >
              + Add
            </DialogTrigger>
            <DialogContent className="bg-white border-none max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProduct setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>

          <button
            className="bg-[#37589F99] p-3 text-white rounded-[8px]"
            onClick={() => exportProducts()}
            disabled={isExportingProducts}
          >
            {isExportingProducts ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductsHeader;
