import { useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useShopContext } from "../contexts/ShopContext";
import { useShops } from "../customHooks/useShop";
import { useUser } from "../customHooks/useUser";
import type { ShopTypes } from "../utils/types";
import { ShoppingCart, Menu } from "lucide-react";
import { usePosTerminalContext } from "../contexts/PosTerminalContext";
import useCurrentTime from "../customHooks/useCurrentTime";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebarContext } from "../contexts/SidebarContext";
import { Button } from "../components/ui/button";

function Header() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { user, isGettingUser } = useUser();
  const { shops, isGettingShops } = useShops();

  const { setShowMobileCart, cartItemCount, showMobileCart } =
    usePosTerminalContext();
  const { toggleSidebar } = useSidebarContext();
  const { handleSetActiveShop, activeShop } = useShopContext();

  const time = useCurrentTime();

  const nonShopRoutes = ["/pos-terminal"];
  const isShopRoute = !nonShopRoutes.includes(location.pathname);
  const isOnline = navigator.onLine;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const shop = shops.find(
      (shop: ShopTypes) => String(shop.id) === e.target.value
    );
    handleSetActiveShop(shop);
    queryClient.invalidateQueries({ queryKey: ["total-sales", shop.id] });
    localStorage.setItem("shopId", shop.id);
  }

  // console.log(user);
  const activeShops = shops?.filter((shop: ShopTypes) => {
    if (user.role === "manager" || user.role === "cashier") {
      const allowedShops = user.shops.map((userShops: any) => userShops.name);
      return allowedShops.includes(shop.name);
    }

    return shop;
  });

  // console.log(activeShops);

  return (
    <header className="md:bg-white border-b border-white px-6 py-4 w-full flex items-center justify-between ">
      {/* Menu Button - Always visible */}
      <div className="flex items-center md:order-first">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4"
          onClick={toggleSidebar}
        >
          <Menu className="size-[24px]" />
        </Button>

        {isShopRoute && (
          <div className="border bg-white flex  rounded-md border-[#88918B4D] divide-x divide-[#88918B4D] items-center ml-auto  md:ml-0">
            <p
              className={`font-medium text-[12px]/[20px] py-3 px-3 ${
                user.role === "cashier"
                  ? "bg-gray-200 text-gray-500 rounded-l-[8px] "
                  : ""
              }`}
            >
              Shop
            </p>
            <select
              className="px-4 font-normal text-[12px]  py-3 flex pr-2 outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:py-[13px] disabled:cursor-not-allowed"
              onChange={handleChange}
              value={activeShop?.id || ""}
              disabled={user.role === "cashier"}
            >
              {isGettingShops && <option>Loading...</option>}
              {!isGettingShops &&
                activeShops.map((shop: ShopTypes) => (
                  <option
                    key={shop.id}
                    className="text-[#88918B] p-3"
                    value={shop.id}
                  >
                    {shop.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      <div className="md:flex items-center space-x-4 hidden">
        <div className="hidden md:flex items-center  gap-1">
          {isOnline ? (
            <>
              <div className="size-3 bg-[#039A03] rounded-full"></div>
              <p className="font-bold text-[12px]">Online</p>
            </>
          ) : (
            <>
              <div className="size-3 bg-[#FF0000] rounded-full"></div>
              <p className="font-bold text-[12px]">Offline</p>
            </>
          )}
        </div>

        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>ND</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-[12px]">
            {!isGettingUser && user.name}
          </h1>
          <p className="font-normal text-[12px] text-[#88918B]">
            {!isGettingUser && user.email}
          </p>
        </div>
      </div>

      {!isShopRoute && (
        <div className="flex items-center space-x-4 md:hidden mx-auto py-[11px]">
          <p className="font-bold text-[12px]">{time}</p>
        </div>
      )}

      {/* Mobile Cart Button */}
      {!showMobileCart && !isShopRoute && (
        <button
          onClick={() => setShowMobileCart(true)}
          className="md:hidden relative  text-black p-2 rounded-lg"
        >
          <ShoppingCart size={25} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      )}
    </header>
  );
}

export default Header;
