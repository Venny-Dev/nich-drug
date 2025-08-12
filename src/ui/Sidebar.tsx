import { useState } from "react";
import { cn } from "../lib/utils";
import { menuItems } from "../utils/data";
import { NavLink } from "react-router";
import { useSidebarContext } from "../contexts/SidebarContext";
import { useUser } from "../customHooks/useUser";
import { LogOutIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useLogout } from "../customHooks/useAuth";
import Loader from "./Loader";
import { authStorage } from "../utils/authStorage";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isOpen, setIsOpen } = useSidebarContext();
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { user } = useUser();
  const [isLogout, setIsLogout] = useState(false);
  const { logOut, isLoggingOut } = useLogout();

  const activeMenus = menuItems.filter((menu) => {
    if (user.role === "cashier")
      return (
        menu.to === "/pos-terminal" ||
        menu.to === "/total-sales" ||
        menu.to === "/settings"
      );

    if (user.role === "manager")
      return !(menu.to === "/shops" || menu.to === "/users");

    return menu;
  });
  // console.log(menuItems);

  function handleLogout() {
    logOut(undefined, {
      onSuccess: () => {
        authStorage.clearAuthState();
      },
    });
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full xl:w-60 md:w-48 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out px-5",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold ">Nich Drugs Co. Ltd</h2>
        </div>

        <nav className="">
          {activeMenus.map((item, index) => {
            return !item.to ? (
              <div key={index}>
                <button
                  key={index}
                  className=" w-full flex items-center px-6 py-3 text-left transition-colors rounded-[8px] font-medium text-[12px] hover:bg-slate-800  justify-between items- cursor-pointer"
                  onClick={() =>
                    setIsProductOpen((isProductOpen) => !isProductOpen)
                  }
                >
                  <div className="flex items-center ">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </div>
                  {isProductOpen ? (
                    <img
                      src="/arrow-down-white-icon.png"
                      alt="arrow-down-icon"
                      className="mt-1"
                    />
                  ) : (
                    <img
                      src="/arrow-right-white-icon.png"
                      alt="arrow-down-icon"
                      className="mt-1"
                    />
                  )}
                </button>
                {isProductOpen && (
                  <div className="ml-[28px]">
                    {item.chidren?.map((child) => (
                      <NavLink
                        to={child.to}
                        key={child.label}
                        className={({ isActive }) =>
                          cn(
                            "w-full flex items-center px-6 py-3 text-left transition-colors rounded-[8px] font-medium text-[12px]",
                            isActive ? "bg-[#37589F99] " : "hover:bg-slate-800 "
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.to}
                key={index}
                className={({ isActive }) =>
                  cn(
                    "w-full flex items-center px-6 py-3 text-left transition-colors rounded-[8px] font-medium text-[12px]",
                    isActive ? "bg-[#37589F99] " : "hover:bg-slate-800 "
                  )
                }
                // onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <Dialog open={isLogout} onOpenChange={setIsLogout}>
          <DialogTrigger className="w-full flex items-center px-6 py-3 text-left transition-colors rounded-[8px] font-medium text-[12px] gap-2 cursor-pointer hover:bg-slate-800 ">
            <LogOutIcon />
            Logout
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <div className="flex items-center gap-3">
              <button
                className="bg-slate-300 text-white w-full rounded-[8px] py-2"
                onClick={() => setIsLogout(false)}
                disabled={isLoggingOut}
              >
                No
              </button>
              <button
                className="bg-slate-800 text-white w-full rounded-[8px] py-2 flex items-center justify-center"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader /> : "Yes"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
