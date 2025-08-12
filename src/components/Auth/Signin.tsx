import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { validateEmail } from "../../utils/helpers";
import Loader from "../../ui/Loader";
import { useSignIn } from "../../customHooks/useAuth";
import { useEffect } from "react";
import { authStorage } from "../../utils/authStorage";

function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // aniokechebe@gmail.com
  // 1234567890
  const { signIn, isSigningIn } = useSignIn();

  useEffect(() => {
    localStorage.removeItem("shopId");
    authStorage.clearAuthState();
  }, []);

  function onSubmit(data: any) {
    signIn(data);
  }
  return (
    <div className="bg-white p-8 rounded-[8px] w-full max-w-[428px]">
      <h1 className="font-semibold text-[20px] text-[#14213D] text-center">
        Nich Drugs Co. Ltd
      </h1>
      <h1 className="my-8 font-semibold text-[20px] text-[#14213D]">
        Sign in to your account
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="">
          <div className="space-y-1">
            <p className="text-[16px] font-normal block text-[#14213D]">
              Email
            </p>
            <input
              type="email"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full"
              placeholder="user@example.com"
              {...register("email", {
                required: "Please enter your email",
                validate: (value) => validateEmail(value) || "Invalid email",
              })}
              disabled={isSigningIn}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {String(errors.email.message)}
              </span>
            )}
          </div>
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
              })}
              disabled={isSigningIn}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {String(errors.password.message)}
              </span>
            )}
          </div>
        </div>
        <Link
          to="forgot-password"
          className="font-normal text-[12px] text-[#14213D] justify-end flex mt-2 "
        >
          Forgot password?
        </Link>

        <button
          className="bg-[#14213D] text-[12px] font-medium text-white w-full mt-6 py-[11px] rounded-[8px] flex items-center justify-center"
          disabled={isSigningIn}
        >
          {isSigningIn ? <Loader /> : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Signin;
