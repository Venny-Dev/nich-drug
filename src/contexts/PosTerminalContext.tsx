import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import indexedDBManager from "../utils/indexedDB";
import { useShopContext } from "./ShopContext";
import { calculateItemTotalDiscount } from "../utils/helpers";
import { toast } from "react-toastify";

interface PosTerminalContextType {
  showMobileCart: boolean;
  setShowMobileCart: (show: boolean) => void;
  tabs: { id: number; name: string; cart: any[] }[];
  setTabs: (tabs: any) => void;
  activeTabId: number;
  setActiveTabId: (id: number) => void;
  cartItemCount: number;
  activeTab: { id: number; name: string; cart: any[] };
  cartTotal: number;
  removeFromCart: (productId: any) => void;
  updateQuantity: (productId: any, newQuantity: any) => void;
  addNewTab: () => void;
  deleteTab: (tabId: any) => void;
  addToCart: (product: any) => void;
  isLoading: boolean;
  updateItemDiscount: (productId: any, discountAmount: number) => void;
  clearActiveTabCart: () => void;

  cartTotalDiscount: number;
}

const PosTerminalContext = createContext<PosTerminalContextType>(
  {} as PosTerminalContextType
);

interface PosTerminalProviderProps {
  children: ReactNode;
}

function PosTerminalProvider({ children }: PosTerminalProviderProps) {
  const { activeShop } = useShopContext();
  const [showMobileCart, setShowMobileCart] = useState(false);

  const [tabs, setTabs] = useState([{ id: 1, name: "Tab", cart: [] }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const activeTab = tabs.find((tab: any) => tab.id === activeTabId);

  useEffect(() => {
    const loadTabsFromDB = async () => {
      if (!activeShop?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cartTabsResult = await indexedDBManager.loadShopCartTabs(
          activeShop?.id
        );
        // console.log(cartTabsResult);

        if (cartTabsResult.tabs && cartTabsResult.tabs.length > 0) {
          setTabs(cartTabsResult.tabs);
          setActiveTabId(cartTabsResult.activeTabId);
          setNextTabId(cartTabsResult.nextTabId);
        } else {
          // Reset to default if no tabs found
          setTabs([{ id: 1, name: "Tab", cart: [] }]);
          setActiveTabId(1);
          setNextTabId(2);
        }
      } catch (error) {
        console.error("Error loading tabs from IndexedDB:", error);
        // Fallback to default state on error
        setTabs([{ id: 1, name: "Tab", cart: [] }]);
        setActiveTabId(1);
        setNextTabId(2);
      } finally {
        setIsLoading(false);
      }
    };

    loadTabsFromDB();
  }, [activeShop?.id]);

  // Save tabs to IndexedDB whenever tabs or activeTabId changes
  useEffect(() => {
    const saveTabsToDB = async () => {
      if (!activeShop?.id || isLoading) return;

      try {
        await indexedDBManager.saveShopCartTabs(
          activeShop?.id,
          tabs,
          activeTabId,
          nextTabId
        );
      } catch (error) {
        toast.error("Error saving tabs. Do not reload the page");
        console.error("Error saving tabs to IndexedDB:", error);
      }
    };

    saveTabsToDB();
  }, [tabs, activeTabId, nextTabId, activeShop?.id, isLoading]);

  ////////////////// TAB LOGIC ////////////////////////
  const addNewTab = () => {
    const newTab = {
      id: nextTabId,
      name: `Tab`,
      cart: [],
    };
    setTabs((prev: any) => [...prev, newTab]);
    setActiveTabId(nextTabId);
    setNextTabId((prev: any) => prev + 1);
  };

  // Delete tab
  const deleteTab = (tabId: any) => {
    if (tabs.length === 1) return; // Don't delete the last tab

    setTabs((prev: any) => prev.filter((tab: any) => tab.id !== tabId));

    // If we're deleting the active tab, switch to another tab
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter((tab: any) => tab.id !== tabId);
      setActiveTabId(remainingTabs[0].id);
    }
  };

  ///////////////////   CART LOGIC //////////////////////
  const addToCart = useCallback(
    (product: any) => {
      setTabs((prev: any) =>
        prev.map((tab: any) => {
          if (tab.id !== activeTabId) return tab;

          const existingItem = tab.cart.find(
            (item: any) => item.id === product.id
          );
          if (existingItem) {
            return {
              ...tab,
              cart: tab.cart.map((item: any) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              ...tab,
              cart: [...tab.cart, { ...product, quantity: 1 }],
            };
          }
        })
      );
    },
    [activeTabId]
  );

  const clearActiveTabCart = useCallback(() => {
    setTabs((prev: any) =>
      prev.map((tab: any) => {
        if (tab.id !== activeTabId) return tab;

        return {
          ...tab,
          cart: [],
        };
      })
    );
  }, [activeTabId]);

  const removeFromCart = useCallback(
    (productId: any) => {
      setTabs((prev: any) =>
        prev.map((tab: any) => {
          if (tab.id !== activeTabId) return tab;

          return {
            ...tab,
            cart: tab.cart.filter((item: any) => item.id !== productId),
          };
        })
      );
    },
    [activeTabId]
  );

  const updateQuantity = useCallback(
    (productId: any, newQuantity: any) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setTabs((prev: any) =>
        prev.map((tab: any) => {
          if (tab.id !== activeTabId) return tab;

          return {
            ...tab,
            cart: tab.cart.map((item: any) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            ),
          };
        })
      );
    },
    [activeTabId, removeFromCart]
  );

  const updateItemDiscount = useCallback(
    (productId: any, discountAmount: number) => {
      setTabs((prev: any) =>
        prev.map((tab: any) => {
          if (tab.id !== activeTabId) return tab;

          return {
            ...tab,
            cart: tab.cart.map((item: any) =>
              item.id === productId
                ? { ...item, discount: Math.max(0, discountAmount || 0) }
                : item
            ),
          };
        })
      );
    },
    [activeTabId]
  );

  const cartItemCount =
    activeTab?.cart.reduce((sum: any, item: any) => sum + item.quantity, 0) ||
    0;

  const cartTotalDiscount =
    activeTab?.cart.reduce(
      (sum: any, item: any) => sum + calculateItemTotalDiscount(item),
      0
    ) || 0;

  const cartSubtotal =
    activeTab?.cart.reduce(
      (sum: any, item: any) => sum + +item.unit_selling_price * item.quantity,
      0
    ) || 0;
  const cartTotal = cartSubtotal - cartTotalDiscount;

  ////////////////////////// ORDER LOGIC ////////////////////////////////////

  return (
    <PosTerminalContext.Provider
      value={{
        showMobileCart,
        setShowMobileCart,
        tabs:
          Array.isArray(tabs) && tabs.length > 0
            ? tabs
            : [{ id: 1, name: "Tab", cart: [] }],
        setTabs,
        activeTabId,
        setActiveTabId,
        cartItemCount,
        activeTab: activeTab || { id: 1, name: "Tab", cart: [] },
        cartTotal,
        removeFromCart,
        updateQuantity,
        addNewTab,
        deleteTab,
        addToCart,
        isLoading,
        updateItemDiscount,
        clearActiveTabCart,
        cartTotalDiscount,
      }}
    >
      {children}
    </PosTerminalContext.Provider>
  );
}

function usePosTerminalContext(): PosTerminalContextType {
  const context = useContext(PosTerminalContext);
  if (context === undefined) {
    throw new Error("usePosTerminalContext must be used within a ShopProvider");
  }
  return context;
}

export { PosTerminalProvider, usePosTerminalContext };

//  useEffect(() => {
//     const cleanupCart = async () => {
//       if (!currentShopId) return;

//       const updatedTabs = await Promise.all(
//         tabs.map(async (tab: any) => ({
//           ...tab,
//           cart: await validateCartProducts(tab.cart)
//         }))
//       );

//       // Only update if there are changes
//       const hasChanges = updatedTabs.some((tab: any, index: number) =>
//         tab.cart.length !== tabs[index].cart.length
//       );

//       if (hasChanges) {
//         setTabs(updatedTabs);
//       }
//     };

//     cleanupCart();
//   }, [currentShopId, validateCartProducts]);
