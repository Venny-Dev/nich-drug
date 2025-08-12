import { useForm } from "react-hook-form";
import { useChangePassword } from "../customHooks/useAuth";
import Loader from "../ui/Loader";

function Settings() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { changePassword, isChangingPassword } = useChangePassword();

  function onSubmit(data: any) {
    changePassword(data, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-bold mb-6">Settings</h1>

      <form
        className="bg-white  rounded-[24px] border border-[#E4E4E4] p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-1 mb-3 ">
          <label className="text-[16px] font-normal block">
            Current Password
          </label>
          <input
            type="password"
            className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
            placeholder="*********"
            {...register("current_password", { required: true })}
          />
          {errors.current_password && (
            <p className="text-red-500 text-xs italic">
              Please input your current password
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block">
              New Password
            </label>
            <input
              type="password"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="*********"
              {...register("new_password", { required: true })}
            />
            {errors.new_password && (
              <p className="text-red-500 text-xs italic">
                Please input your new password
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[16px] font-normal block">
              Confirm New Password
            </label>
            <input
              type="password"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="*********"
              {...register("new_password_confirmation", { required: true })}
            />
            {errors.new_password_confirmation && (
              <p className="text-red-500 text-xs italic">
                Please confirm your new password
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#37589F99] text-white rounded-[8px] w-full max-w-[78px] mt-[59px] ml-auto flex  items-center justify-center py-3 hover:bg-[#37589F] transition-colors cursor-pointer duration-300"
        >
          {isChangingPassword ? <Loader /> : "Save"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
