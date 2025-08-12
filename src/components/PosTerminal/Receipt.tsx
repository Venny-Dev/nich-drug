import { capitalizeFirst } from "../../utils/helpers";

function Receipt({ orderData }: any) {
  // console.log(orderData);
  return (
    <div
      className="max-w-[7.2cm] mx-auto bg-white"
      style={{ width: "7.2cm", fontSize: "12px" }}
    >
      <div className="px-2 py-2" id="receipt-content">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-sm font-bold leading-tight">
            NICH DRUGS PHARMACY
          </h1>
          <p className="text-xs text-gray-600 leading-tight mt-1">
            {capitalizeFirst(orderData?.address || "")}
          </p>
        </div>

        {/* Order Info */}
        {/* <div className="mb-3 text-xs leading-tight">
          <div className="flex justify-between mb-1">
            <span>Date: {orderData?.date || ""}</span>
            <span>Time: {orderData?.time || ""}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shop: {orderData?.shopName || ""}</span>
            <span>Cashier: {orderData?.cashier || ""}</span>
          </div>
          <div>
            <span>POS Terminal</span>
          </div>
        </div> */}

        <div className="mb-3 text-xs leading-tight">
          <div className="flex justify-between mb-1">
            <span>Date: {orderData.date}</span>
            <span>Time: {orderData.time}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shop: {orderData.shopName}</span>
            <span>POS Terminal</span>
          </div>
          <div className="mb-1">
            <span>Cashier: {orderData.cashier}</span>
          </div>
        </div>

        {/* Items Header */}
        <div className="border-t border-b border-gray-400 py-1 mb-2">
          <div className="flex text-xs font-bold">
            <span className="flex-1">Item</span>
            <span className="w-8 text-center">Qty</span>
            <span className="w-12 text-right">NGN</span>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-3">
          {orderData?.items.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              {/* Item name on its own line if long */}
              <div className="text-xs leading-tight">
                <div className="break-words pr-1">{item.name}</div>
                <div className="flex justify-between mt-1">
                  <span className="flex-1"></span>
                  <span className="w-8 text-center">{item.qty}</span>
                  <span className="w-12 text-right">
                    {item.amount * item.qty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-400 pt-2">
          <div className="text-xs space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>{orderData?.discount || "0.00"}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sub total:</span>
              <span>{orderData?.subTotal || 0}</span>
            </div>
          </div>

          <div className="text-xs mb-3">
            <div className="flex justify-between">
              <span>Payment:</span>
              <span>{capitalizeFirst(orderData?.paymentMethod || "")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-medium border-t border-gray-400 pt-2">
          <p>THANK YOU FOR SHOPPING</p>
          <p className="mt-1 break-words">
            Visit us again at
            <br />
            nichdrugss.com.ng
          </p>
        </div>
      </div>
    </div>
  );
}

export default Receipt;

{
  /* <div className="flex justify-between mt-1">
  <span>Tx ID:</span>
  <span>{orderData.transactionId}</span>
</div> */
}
