import { formatCurrency } from "../../utils/helpers";
import type { OnlineSale } from "../../utils/types";
import Receipt from "../PosTerminal/Receipt";
import { useShopContext } from "../../contexts/ShopContext";
import { ReceiptIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

function Sale({
  sale,
  allSalesData,
}: {
  sale: any;
  allSalesData: OnlineSale[] | undefined;
}) {
  const { activeShop } = useShopContext();

  // console.log(allSalesData);

  const getReceiptData = () => {
    if (!allSalesData) return null;

    // Extract order ID from sale.id (remove "TRX" prefix and convert to number)
    const orderId = sale.id.replace("TRX", "");

    // Find all items for this order
    const orderItems = allSalesData.filter(
      (item) => item.order_id.toString().padStart(3, "0") === orderId
    );

    if (orderItems.length === 0) return null;

    const firstItem = orderItems[0];

    // Transform data to receipt format
    return {
      address: activeShop?.address || "No Address Available",
      shopName: activeShop?.name || "Nich Drugs Pharmacy",
      phone: "",
      date: new Date(firstItem.date).toLocaleDateString(),
      time: "not available",
      cashier: firstItem.cashier_name,
      items: orderItems.map((item) => ({
        qty: parseInt(item.quantity) || 1,
        amount: parseFloat(item.amount),
        name: item.item_name,
      })),
      subTotal: sale.totalAmount,
      paymentMethod: sale.paymentType.toLowerCase(),
      discount: 0,
      receiptNumber: sale.id,
    };
  };

  // console.log(sale);

  const receiptData = getReceiptData();

  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t-2 border-[#88918B4D] items-center pl-5">
      <div className="min-w-[110px] text-[16px] font-normal  ">{sale.date}</div>
      <div className="flex items-center gap-3 min-w-[100px] text-[16px] ">
        {sale.id}
      </div>
      <div className="ml-5 min-w-[120px] text-[16px] ">{sale.paymentType}</div>
      <div className="font-normal text-[16px]  ml-3 min-w-[100px] ">
        {formatCurrency(sale.totalAmount)}
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[210px]  max-w-[210px]">
        {sale.itemsSold}
      </div>
      <div className="ml-5 min-w-[100px] text-[12px]">
        {sale.paymentStatus === "paid" ? (
          <p className="bg-[#08AA0833] text-[#08AA08] w-fit px-2 py-1   rounded-full">
            Paid
          </p>
        ) : (
          <p className="bg-[#88918B4D] text-[#88918B] w-fit px-2 py-1   rounded-full">
            Not Paid
          </p>
        )}
      </div>
      <div className="ml-5 min-w-[50px]">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-[#88918B] text-white p-2 rounded text-[12px] hover:bg-[#88918B]/80">
              <ReceiptIcon size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                Receipt
                <button
                  onClick={() => window.print()}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Print
                </button>
              </DialogTitle>
            </DialogHeader>
            {receiptData && <Receipt orderData={receiptData} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Sale;
