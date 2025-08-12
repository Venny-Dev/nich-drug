import { Controller, useForm } from "react-hook-form";
import { useShops } from "../../customHooks/useShop";
import type { ShopTypes, UserTypes } from "../../utils/types";
import { useCreateUser, useUpdateUser } from "../../customHooks/useUser";
import Loader from "../../ui/Loader";
import { validateEmail } from "../../utils/helpers";
import Select from "react-select";

interface AddUserProps {
  user?: UserTypes;
  setIsModalOpen?: (isOpen: boolean) => void;
}

function AddUser({ user, setIsModalOpen }: AddUserProps) {
  const { shops } = useShops();
  const { createUser, isCreatingUser } = useCreateUser();
  const { updateUser, isUpdatingUser } = useUpdateUser();

  const defaultShopValue = shops.reduce(
    (acc: { value: string; label: string }[], shop: ShopTypes) => {
      if (user?.shops.includes(shop.name)) {
        acc.push({
          value: shop.id,
          label: shop.name,
        });
      }
      return acc;
    },
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      shopId: defaultShopValue,
      password: "",
      confirmPassword: "",
    },
  });

  // console.log(user);

  function onSubmit(data: any) {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    if (validateEmail(data.email) === false) {
      setError("email", {
        type: "manual",
        message: "Invalid email",
      });
      return;
    }

    if (data.role === "cashier" && data.shopId.length > 1) {
      setError("shopId", {
        type: "manual",
        message: "Cashier can only be assigned to one shop",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    data.shopId.forEach((shop: { value: string }, index: number) => {
      formData.append(`shop_ids[${index}]`, shop.value);
    });

    if (!user) {
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);
      createUser(formData, {
        onSuccess: () => {
          setIsModalOpen?.(false);
        },
      });
    }

    if (user) {
      updateUser(
        {
          id: user.id,
          data: formData,
        },
        {
          onSuccess: () => {
            setIsModalOpen?.(false);
          },
        }
      );
    }
  }

  const options = shops.map((shop: ShopTypes) => ({
    value: shop.id,
    label: shop.name,
  }));

  const isLoading = isCreatingUser || isUpdatingUser;

  return (
    <div className="flex-1 overflow-y-auto pr-2 h-[500px] md:h-auto">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Name</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="Enter User Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">
              {String(errors.name.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Role</label>
          <select
            className="px-4 font-normal text-[12px]  py-3 flex pr-2 outline-none w-full border border-[#88918B4D] rounded-[8px]"
            {...register("role", { required: "Role is required" })}
          >
            <option value="">Select Role</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-xs">
              {String(errors.role.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Shop</label>
          <Controller
            name="shopId"
            control={control}
            rules={{ required: "Please include a shop" }}
            render={({ field }) => (
              <Select
                className="w-full"
                isMulti
                options={options}
                onChange={(value) => field.onChange(value)}
                value={field.value}
              />
            )}
          />
          {errors.shopId && (
            <p className="text-red-500 text-xs">
              {String(errors.shopId.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[16px] font-normal block">Email</label>
          <input
            type="text"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="user@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[16px] font-normal block">Password</label>
              <input
                type="password"
                className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
                placeholder="*******"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[16px] font-normal block">
                Confirm Password
              </label>
              <input
                type="password"
                className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
                placeholder="*********"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {String(errors.confirmPassword.message)}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#37589F99] text-white rounded-[8px] w-full py-3 hover:bg-[#37589F] transition-colors flex justify-center items-center "
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
