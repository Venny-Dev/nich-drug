import { ArrowLeft, Printer } from "lucide-react";
import { usePosTerminalContext } from "../../contexts/PosTerminalContext";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PosCartMobile from "./PosCartMobile";
import {
  // fallbackToBrowserPrint,
  formatCurrency,
  // generateReceiptCommands,
  generateSecureId,
} from "../../utils/helpers";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useShopContext } from "../../contexts/ShopContext";
import { useUser } from "../../customHooks/useUser";
import { useSyncOrders } from "../../customHooks/useOrders";
import Receipt from "./Receipt";
import indexedDBManager from "../../utils/indexedDB";
import { toast } from "react-toastify";
// import {
//   fallbackToBrowserPrint,
//   generateReceiptCommands,
// } from "../../utils/receiptHelper";

function MobileCartView() {
  const {
    setShowMobileCart,
    activeTab,
    cartTotal,
    removeFromCart,
    updateQuantity,
    cartTotalDiscount,
    isLoading: isCartLoading,
    // clearActiveTabCart,
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
      setIsOpen(false);
      setShowPrintReceipt(true);

      const data = {
        shop_id: activeShop?.id,
        orders: [order],
      };

      syncOrders(data);
    }

    if (!navigator.onLine) {
      console.log("is offline");
      try {
        // Add product names to items for offline orders
        const itemsWithNames = activeTab.cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          discount: item.discount || 0,
          price: item.unit_selling_price,
          product_name: item.name || item.product_name || `Product ${item.id}`,
        }));

        const offlineOrder = {
          ...order,
          items: itemsWithNames,
          timestamp: Date.now(),
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

  const handlePrint = () => {
    window.print();
  };

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
  //       await port.open({ baudRate: 9600 });

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

  return (
    <div className="min-h-screen bg-white flex flex-col ">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileCart(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="font-semibold text-lg">Cart </h1>
        <div className="w-16"></div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-x-auto flex flex-col">
        <div className="p-4 border-b">
          <div className="grid grid-flow-col auto-cols-max font-semibold text-[12px] text-[#88918B] mr-6">
            <span className="min-w-[130px] ">Product</span>
            <span className="min-w-[90px] ">Qty</span>
            <span className="min-w-[90px] ">Price</span>
            <span className="min-w-[110px] ">Subtotal</span>
            <span>Discount</span>
          </div>
        </div>

        <div className="flex-1 ">
          {activeTab?.cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items in cart</p>
            </div>
          ) : (
            <div className="p-4 space-y-10">
              {activeTab.cart.map((item: any) => (
                <PosCartMobile
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Section */}
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

          <div className="mt-[50px] flex  flex-col">
            <div className="flex ml-auto gap-4 ">
              <p>Payment</p>
              <RadioGroup
                className="flex gap-4 mb-4 flex-wrap "
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
              onClick={() => setShowPrintReceipt(false)}
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

export default MobileCartView;
