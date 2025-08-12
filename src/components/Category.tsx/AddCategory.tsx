import { useForm } from "react-hook-form";
import {
  useCreateCategory,
  useUpdateCategory,
} from "../../customHooks/useCategories";
import Loader from "../../ui/Loader";
import type { CategoryTypes } from "../../utils/types";
import { useShopContext } from "../../contexts/ShopContext";

type AddCategoryProps = {
  setIsOpen: (isOpen: boolean) => void;
  category?: CategoryTypes;
};

function AddCategory({ setIsOpen, category }: AddCategoryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      status: category?.status || "active",
    },
  });

  const { activeShop } = useShopContext();

  const { createCategory, isCreatingCategory } = useCreateCategory();
  const { updateCategory, isUpdatingCategory } = useUpdateCategory();

  function onSubmit(data: any) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("shop_id", `${activeShop?.id}`);

    if (!category) {
      createCategory(formData, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    }

    if (category) {
      const dataApi = {
        name: data.name,
        description: data.description,
        status: data.status,
        shop_id: `${activeShop?.id}`,
      };

      updateCategory(
        { id: category.id, data: dataApi },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
  }

  const isLoading = isCreatingCategory || isUpdatingCategory;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <label className="text-[16px] font-normal block">Category Name</label>
        <input
          type="text"
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
          placeholder="Enter Category Name"
          {...register("name", { required: true })}
          disabled={isLoading}
        />
        {errors.name && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-[16px] font-normal block">Description</label>
        <textarea
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
          placeholder="Enter Description"
          {...register("description", { required: true })}
          disabled={isLoading}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-[16px] font-normal block">Status</label>
        <select
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full bg-white"
          {...register("status", { required: true })}
        >
          <option value={"active"}>Active</option>
          <option value={"inactive"}>Inactive</option>
        </select>
        {errors.status && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default AddCategory;
