import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddCategory from "./AddCategory";
import { useExportCategories } from "../../customHooks/useExports";

function CategoryHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { exportCategories, isExportingCategories } = useExportCategories();
  return (
    <div className="flex justify-between  items-center">
      <h1 className="font-bold text-[16px] lg:text-[24px]">Category</h1>
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
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <AddCategory setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>

        <button
          className="bg-[#37589F99] p-3 text-white rounded-[8px]"
          onClick={() => exportCategories()}
          disabled={isExportingCategories}
        >
          {isExportingCategories ? "Exporting..." : "Export"}
        </button>
      </div>
    </div>
  );
}

export default CategoryHeader;
