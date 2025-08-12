import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ShopTypes } from "../utils/types";
import { useShops } from "../customHooks/useShop";
import { useUser } from "../customHooks/useUser";

interface ShopContextType {
  activeShop: ShopTypes | undefined;
  setActiveShop: (shop: ShopTypes | undefined) => void;
  handleSetActiveShop: (shop: ShopTypes | undefined) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const ShopContext = createContext<ShopContextType>({} as ShopContextType);

interface ShopProviderProps {
  children: ReactNode;
}

function ShopProvider({ children }: ShopProviderProps) {
  const { shops, isGettingShops } = useShops();
  const { user } = useUser();

  const [activeShop, setActiveShop] = useState<ShopTypes>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const shopId = localStorage.getItem("shopId");
    // console.log(shopId);
    if (shopId) {
      // console.log(shops);
      const shop =
        !isGettingShops &&
        shops?.find((shop: ShopTypes) => String(shop.id) === shopId);

      if (shop) {
        setActiveShop(shop);
      }
    } else {
      if (!isGettingShops) {
        const activeShops = shops?.filter((shop: ShopTypes) => {
          if (user.role === "manager" || user.role === "cashier") {
            const allowedShops = user.shops.map(
              (userShops: any) => userShops.name
            );
            return allowedShops.includes(shop.name);
          }

          return shop;
        });

        setActiveShop(activeShops[0]);
        // console.log(shops);
      }
    }
  }, [shops, isGettingShops]);

  function handleSetActiveShop(shop: ShopTypes | undefined) {
    setActiveShop(shop);
  }

  // console.log(activeShop);
  return (
    <ShopContext.Provider
      value={{
        activeShop,
        setActiveShop,
        handleSetActiveShop,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

function useShopContext(): ShopContextType {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
}

export { ShopProvider, useShopContext };
