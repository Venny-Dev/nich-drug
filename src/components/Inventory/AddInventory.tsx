import { useForm } from "react-hook-form";
import { useUpdateInventory } from "../../customHooks/useInventories";
import Loader from "../../ui/Loader";
import { useShopContext } from "../../contexts/ShopContext";

interface AddInventoryProps {
  setIsOpen: (isOpen: boolean) => void;
  inventory: any;
}

function AddInventory({ inventory, setIsOpen }: AddInventoryProps) {
  const { activeShop } = useShopContext();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      product: inventory?.name,
      quantity: inventory?.stock,
      description: inventory?.description,
      newQuantity: 0,
    },
  });

  // console.log(inventory);
  const { updateInventory, isUpdatingInventory } = useUpdateInventory();

  function onSubmit(data: any) {
    // console.log(data);
    const apiData = {
      shop_id: activeShop?.id,
      quantity: data.newQuantity,
      product: data.product,
      description: data.description,
    };
    updateInventory(
      { data: apiData, id: inventory?.product_id },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Product</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter Shop Name"
            disabled
            {...register("product")}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Quantity</label>
          <input
            type="number"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="100"
            {...register("quantity")}
            disabled
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[16px] font-normal block">Description</label>
        <textarea
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
          placeholder="Enter Description"
          {...register("description")}
          disabled
        />
      </div>
      <div className="space-y-1">
        <label className="text-[16px] font-normal block">
          Quantity to be added{" "}
        </label>
        <input
          type="number"
          className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
          placeholder="100"
          {...register("newQuantity")}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors flex items-center justify-center"
        >
          {isUpdatingInventory ? <Loader /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default AddInventory;
