import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="bg-slate-900 h-screen flex justify-center items-center px-5">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
