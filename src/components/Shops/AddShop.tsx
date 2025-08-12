import { useForm } from "react-hook-form";
import { useCreateShop, useUpdateShop } from "../../customHooks/useShop";
import Loader from "../../ui/Loader";
import type { ShopTypes } from "../../utils/types";

type AddShopProps = {
  setIsOpen: (isOpen: boolean) => void;
  shop?: ShopTypes;
};

function AddShop({ setIsOpen, shop }: AddShopProps) {
  const form = useForm({
    defaultValues: {
      name: shop?.name || "",
      description: shop?.description || "",
      address: shop?.address || "",
      city: shop?.city || "",
      state: shop?.state || "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const { createShop, isCreatingShop } = useCreateShop();
  const { updateShop, isUpdatingShop } = useUpdateShop();

  function onSubmit(data: any) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);

    if (!shop) {
      createShop(formData, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    }

    if (shop) {
      updateShop(
        { id: shop.id, data },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
  }

  const isLoading = isCreatingShop || isUpdatingShop;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* First row - Shop Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="">
          <label className="text-[16px] font-normal block">Shop Name</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full mt-1"
            placeholder="Enter Shop Name"
            {...register("name", { required: true })}
            disabled={isLoading}
          />
          {errors.name && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Description</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Admin@nichdrugs.com"
            {...register("description", { required: true })}
            disabled={isLoading}
          />
          {errors.description && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[16px] font-normal block">Address</label>
        <input
          type="text"
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
          placeholder="Enter Address"
          {...register("address", { required: true })}
          disabled={isLoading}
        />
        {errors.address && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">City</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter City"
            {...register("city", { required: true })}
            disabled={isLoading}
          />
          {errors.city && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">State</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter State"
            {...register("state", { required: true })}
            disabled={isLoading}
          />
          {errors.state && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default AddShop;
