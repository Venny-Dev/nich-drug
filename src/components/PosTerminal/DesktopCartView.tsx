import { usePosTerminalContext } from "../../contexts/PosTerminalContext";
import PosCart from "./PosCart";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { formatCurrency, generateSecureId } from "../../utils/helpers";
import { useShopContext } from "../../contexts/ShopContext";
import { useUser } from "../../customHooks/useUser";
import { useSyncOrders } from "../../customHooks/useOrders";
import Receipt from "./Receipt";
import { Printer } from "lucide-react";
import indexedDBManager from "../../utils/indexedDB";
import { toast } from "react-toastify";
// import {
//   fallbackToBrowserPrint,
//   generateReceiptCommands,
// } from "../../utils/receiptHelper";

function DesktopCartView() {
  const {
    cartTotal,
    removeFromCart,
    updateQuantity,
    activeTab,
    isLoading: isCartLoading,
    cartTotalDiscount,
    clearActiveTabCart,
  } = usePosTerminalContext();

  const { activeShop } = useShopContext();
  const { user } = useUser();
  const { syncOrders } = useSyncOrders();

  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (isCartLoading) {
    return <div>Loading cart...</div>;
  }

  async function handleCompleteOrder() {
    const items = activeTab.cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      discount: item.discount || 0,
      price: item.unit_selling_price,
    }));
    const id = generateSecureId();

    const order = {
      offline_id: id,
      user_id: user.id,
      discount: cartTotalDiscount,
      total: cartTotal,
      payment_method: paymentMethod,
      items,
    };

    if (navigator.onLine) {
      // console.log(id);
      setIsOpen(false);
      setShowPrintReceipt(true);

      const data = {
        shop_id: activeShop?.id,
        orders: [order],
      };

      // console.log(data);
      syncOrders(data);
    }

    if (!navigator.onLine) {
      // console.log("is offline");
      try {
        // Add product names to items for offline orders
        const itemsWithNames = activeTab.cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          discount: item.discount || 0,
          price: item.unit_selling_price,
          product_name: item.name || item.product_name || `Product ${item.id}`, // Add product name
        }));

        const offlineOrder = {
          ...order,
          items: itemsWithNames, // Use items with product names
          timestamp: Date.now(), // Add timestamp for offline orders
        };

        await indexedDBManager.addOrder(activeShop?.id || "", offlineOrder);
      } catch (err: any) {
        console.log(err);
        toast.error(err.message);
      }
    }

    setIsOpen(false);
    setShowPrintReceipt(true);
  }

  const orderData = {
    address: activeShop?.address,
    shopName: activeShop?.name,
    phone: "Tel: +234 123 456 7890",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    cashier: user.name,
    items: activeTab.cart.map((item) => ({
      qty: item.quantity,
      amount: +item.unit_selling_price,
      name: item.name,
    })),
    subTotal: cartTotal,
    paymentMethod: paymentMethod,
    discount: cartTotalDiscount,
  };

  // async function handlePrintReceipt() {
  //   try {
  //     if ("serial" in navigator) {
  //       const port = await (navigator as any).serial.requestPort();
  //       await port.open({ baudRate: 115200 });

  //       const writer = port.writable.getWriter();
  //       const encoder = new TextEncoder();

  //       // Generate receipt commands from order data
  //       const commands = generateReceiptCommands(orderData);

  //       // Send each command to the printer
  //       for (const command of commands) {
  //         await writer.write(encoder.encode(command));
  //       }

  //       writer.releaseLock();
  //       await port.close();

  //       console.log("Receipt printed successfully!");
  //     } else {
  //       console.error("Web Serial API not supported");
  //       // Fallback to browser print
  //       fallbackToBrowserPrint(orderData);
  //     }
  //   } catch (error) {
  //     console.error("Print failed:", error);
  //     // Fallback to browser print
  //     fallbackToBrowserPrint(orderData);
  //   }
  // }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full md:flex flex-col  hidden lg:flex-1 md:mt-10 lg:mt-0 ">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-4">Cart</h2>
        <div className="flex items-center justify-between grid-flow-col auto-cols-max font-semibold text-[12px] text-[#88918B] mr-10 w-full">
          <span className="lg:max-w-[60px] xl:max-w-[70px] md:min-w-[100px] lg:min-w-auto">
            Product
          </span>
          <span className=" ">Qty</span>
          <span className="">Price</span>
          <span className="">Subtotal</span>
          <span>Discount</span>
          <span> </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab?.cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No items in cart</p>
          </div>
        ) : (
          <div className="p-4 space-y-10 ">
            {activeTab.cart.map((item: any) => (
              <PosCart
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      {/*Summary and Checkout */}
      {activeTab?.cart.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span className="font-bold text-[16px] text-gray-400">
              Total Discount
            </span>
            <span className="text-red-500 text-[16px]">
              -{formatCurrency(cartTotalDiscount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span className="font-bold text-[24px]">Total</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>

          <div className="mt-[25px] flex  flex-col">
            <div className="flex ml-auto gap-4">
              <p>Payment</p>
              <RadioGroup
                // defaultValue="cash"
                className="flex gap-4 mb-4 "
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="card" id="r1" />
                  <label htmlFor="r1"> Card</label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="cash" id="r2" />
                  <label htmlFor="r2">Cash</label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="transfer" id="r3" />
                  <label htmlFor="r3">Transfer</label>
                </div>
              </RadioGroup>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger
                className="bg-[#37589F99] rounded-[8px] py-[11px] text-white w-fit px-6 ml-auto mt-6"
                role="button"
              >
                Complete
              </DialogTrigger>
              <DialogContent className="bg-white border-none max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to complete this sale?
                  </DialogTitle>
                </DialogHeader>
                <p className="text-[14px] ">
                  Make sure payment has been confirmed before completing sale
                </p>
                <div className="w-full flex justify-end gap-4 mt-3">
                  <Button
                    className="w-[100px] bg-red-500 hover:bg-opacity-70"
                    onClick={() => setIsOpen(false)}
                  >
                    No
                  </Button>
                  <Button
                    className="w-[100px] bg-[#37589F99] hover:bg-opacity-50"
                    onClick={handleCompleteOrder}
                  >
                    Yes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      <Dialog open={showPrintReceipt} onOpenChange={setShowPrintReceipt}>
        <DialogContent className="bg-white border-none  flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center justify-center">
              <img src="/printer-icon.png" alt="" />
              <p>Print Receipt</p>
            </DialogTitle>
          </DialogHeader>
          <div className="flex  gap-4 mt-3 w-fit">
            <Button
              className="w-[100px] bg-white rounded-[8px] border hover:bg-opacity-70 text-black"
              onClick={() => {
                setShowPrintReceipt(false);
                clearActiveTabCart();
              }}
            >
              No
            </Button>
            <Button
              className="w-[100px] bg-[#37589F99] hover:bg-opacity-50"
              onClick={async () => {
                setShowPrintReceipt(false);
                setShowReceipt(true);
                // try {
                //   await handlePrintReceipt();
                //   clearActiveTabCart();
                // } catch (error) {
                //   console.error("Print failed:", error);
                // }
              }}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showReceipt && (
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-[340px]  max-h-[90vh] overflow-y-auto font-mono">
            <DialogTitle className="flex justify-between items-center border-b pb-4">
              <p className="text-lg font-semibold">Print Receipt</p>
              <button
                onClick={handlePrint}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
            </DialogTitle>
            <div className="pt-4">
              <Receipt orderData={orderData} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DesktopCartView;
