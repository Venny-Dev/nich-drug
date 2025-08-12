import { useForm } from "react-hook-form";
import { validateEmail } from "../../utils/helpers";
import Loader from "../../ui/Loader";
import { useForgotPassword } from "../../customHooks/useAuth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { forgotPassword, isForgettingPassword } = useForgotPassword();

  function onSubmit(data: any) {
    forgotPassword(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Reset link sent successfully!");
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send reset link");
      },
    });
  }

  return (
    <div className="bg-white p-8 rounded-[8px] w-full max-w-[428px]">
      <h1 className="font-semibold text-[20px] text-[#14213D] text-center">
        Nich Drugs Co. Ltd
      </h1>
      <h1 className="mt-8 font-semibold text-[20px] text-[#14213D]">
        Reset Password
      </h1>
      <p className="text-[12px] font-normal text-[#88918B] mb-8">
        Enter your email to recieve a password reset link
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="">
          <div className="space-y-1">
            <label className="text-[16px] font-normal block text-[#14213D]">
              Email
            </label>
            <input
              type="email"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="user@example.com"
              {...register("email", {
                required: "Please enter your email",
                validate: (value) => validateEmail(value) || "Invalid email",
              })}
              disabled={isForgettingPassword}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {String(errors.email.message)}
              </span>
            )}
          </div>
        </div>

        <button 
          type="submit"
          className="bg-[#14213D] text-[12px] font-medium text-white w-full mt-6 py-[11px] rounded-[8px] flex items-center justify-center"
          disabled={isForgettingPassword}
        >
          {isForgettingPassword ? <Loader /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
