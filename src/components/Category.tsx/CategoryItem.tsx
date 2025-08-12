import { useState } from "react";
import type { CategoryTypes } from "../../utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddCategory from "./AddCategory";
import DeleteModal from "../../ui/DeleteModal";
import { useDeleteCategory } from "../../customHooks/useCategories";

type CategoryItemProps = {
  category: CategoryTypes;
};

function CategoryItem({ category }: CategoryItemProps) {
  // console.log(category);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteCategory, isDeletingCategory } = useDeleteCategory();
  return (
    <div className="grid grid-cols-5  py-4 border-t-2 border-[#88918B4D] items-center pl-5">
      <div className=" min-w-[100px] text-[16px]">{category.name}</div>
      <div className="min-w-[100px]  text-[16px] font-normal ">
        {category.product_count}
      </div>
      <div className="min-w-[100px] text-[16px] font-normal ">
        {category.description}
      </div>
      <div className="ml-5 min-w-[180px] text-[12px]">
        {category.status === "active" ? (
          <p className="bg-[#08AA0833] text-[#08AA08] w-fit px-2 py-1   rounded-full">
            Active
          </p>
        ) : (
          <p className="bg-[#88918B4D] text-[#88918B] w-fit px-2 py-1   rounded-full">
            Inactive
          </p>
        )}
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
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <AddCategory setIsOpen={setIsOpen} category={category} />
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
              onDelete={deleteCategory}
              isDeleting={isDeletingCategory}
              name={`${category.name} category`}
              id={`${category.id}`}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CategoryItem;
