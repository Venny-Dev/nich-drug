import { useForm } from "react-hook-form";
import { useCategories } from "../../customHooks/useCategories";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../../customHooks/useProducts";

import type { CategoryTypes, ProductTypes } from "../../utils/types";
import Loader from "../../ui/Loader";
import { useShopContext } from "../../contexts/ShopContext";

type AddProductProps = {
  setIsOpen: (value: boolean) => void;
  product?: ProductTypes;
};

function AddProduct({ setIsOpen, product }: AddProductProps) {
  const { categories, isGettingCategories } = useCategories();
  const { createProduct, isCreatingProduct } = useCreateProduct();
  const { updateProduct, isUpdatingProduct } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      barcode: product?.barcode || "",
      category_id: product?.category.id || "",
      product_type: product?.product_type || "",
      stock: product?.stock || "",
      unit_purchase_price: product?.unit_purchase_price || "",
      unit_selling_price: product?.unit_selling_price || "",
      description: product?.description || "",
    },
  });
  // console.log(product);

  const productType = watch("product_type");

  const { activeShop } = useShopContext();

  function onSubmit(data: any) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category_id", data.category_id);
    formData.append("product_type", data.product_type);
    formData.append("shop_id", `${activeShop?.id}`);
    formData.append("unit_purchase_price", data.unit_purchase_price);
    formData.append("unit_selling_price", data.unit_selling_price);
    formData.append("description", data.description);

    if (data.product_type !== "services") {
      formData.append("barcode", data.barcode);
      formData.append("stock", data.stock);
    }
    if (!product) {
      createProduct(formData, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    }

    if (product) {
      updateProduct(
        {
          id: product.id,
          data,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
  }

  const isLoading = isCreatingProduct || isUpdatingProduct;

  return (
    <div className="flex-1 overflow-y-auto pr-2 h-[500px] md:h-auto">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Product Name</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter Product Name"
            {...register("name", { required: true })}
            disabled={isLoading}
          />
          {errors.name && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">
              Product Type
            </label>
            <select
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full bg-white"
              {...register("product_type", { required: true })}
              disabled={isLoading}
            >
              <option value="">Select Product Type</option>
              <option value="single">Single</option>
              <option value="bulk">Bulk</option>
              <option value="pack">Pack</option>
              <option value="bundle">Bundle</option>
              <option value="services">Service</option>
            </select>
            {errors.product_type && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">Category</label>
            <select
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full bg-white"
              {...register("category_id", { required: true })}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              {isGettingCategories ? (
                <option value="">Loading...</option>
              ) : (
                categories.map((category: CategoryTypes) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {errors.category_id && (
              <span className="text-red-500 text-xs ">
                This field is required
              </span>
            )}
          </div>
        </div>

        {productType !== "services" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[16px] font-normal block">Barcode</label>
              <input
                type="text"
                className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
                placeholder="Enter Barcode"
                {...register("barcode", { required: true })}
                disabled={isLoading}
              />
              {errors.barcode && (
                <span className="text-red-500 text-xs ">
                  This field is required
                </span>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[16px] font-normal block">Stock</label>
              <input
                type="text"
                className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
                placeholder="Enter Stock"
                {...register("stock", { required: true })}
                disabled={isLoading}
              />
              {errors.stock && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-4 ${
            productType === "service" ? "sm:grid-cols-1 " : "sm:grid-cols-2"
          }`}
        >
          {productType !== "service" && (
            <div className="space-y-1">
              <label className="text-[16px] font-normal block">
                Unit Purchasing price
              </label>
              <input
                type="text"
                className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
                placeholder="Enter buying price"
                {...register("unit_purchase_price", { required: true })}
                disabled={isLoading}
              />
              {errors.unit_purchase_price && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
          )}
          <div className="space-y-1 ">
            <label className="text-[16px] font-normal block">
              Unit Selling price
            </label>
            <input
              type="text"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="Enter selling price"
              {...register("unit_selling_price", { required: true })}
              disabled={isLoading}
            />
            {errors.unit_selling_price && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Description</label>
          <textarea
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter Description"
            {...register("description")}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
