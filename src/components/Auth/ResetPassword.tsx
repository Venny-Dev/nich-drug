import { useForm } from "react-hook-form";
import Loader from "../../ui/Loader";
import { useResetPassword } from "../../customHooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const { resetPassword, isResettingPassword } = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token and email from URL params
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const watchPassword = watch("password");

  function onSubmit(data: any) {
    const formData = new FormData();
    formData.append("token", token || "");
    formData.append("email", email || "");
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    resetPassword(formData, {
      onSuccess: (response) => {
        toast.success(response.message || "Password reset successfully!");
        reset();
        navigate("/auth"); // Redirect to sign in page
      },
      onError: (error) => {
        toast.error(error.message || "Failed to reset password");
      },
    });
  }

  return (
    <div className="bg-white p-8 rounded-[8px] w-full max-w-[428px]">
      <h1 className="font-semibold text-[20px] text-[#14213D] text-center">
        Nich Drugs Co. Ltd
      </h1>
      <h1 className="mt-8 font-semibold text-[20px] text-[#14213D]">
        Enter New Password
      </h1>
      <p className="mb-8 font-normal text-[12px] text-[#88918B]">
        Set new password for your account
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="">
          <div className="space-y-1 mt-6">
            <p className="text-[16px] font-normal block text-[#14213D]">
              Password
            </p>
            <input
              type="password"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="*********"
              {...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              disabled={isResettingPassword}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {String(errors.password.message)}
              </span>
            )}
          </div>

          <div className="space-y-1 mt-6">
            <p className="text-[16px] font-normal block text-[#14213D]">
              Confirm password
            </p>
            <input
              type="password"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="*********"
              {...register("password_confirmation", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watchPassword || "Passwords do not match",
              })}
              disabled={isResettingPassword}
            />
            {errors.password_confirmation && (
              <span className="text-red-500 text-xs">
                {String(errors.password_confirmation.message)}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#14213D] text-[12px] font-medium text-white w-full mt-6 py-[11px] rounded-[8px] flex items-center justify-center"
          disabled={isResettingPassword}
        >
          {isResettingPassword ? <Loader /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
