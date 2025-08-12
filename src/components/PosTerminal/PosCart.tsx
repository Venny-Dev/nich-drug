import { Minus, Plus, X } from "lucide-react";
import { calculateItemSubtotal, formatCurrency } from "../../utils/helpers";
import { usePosTerminalContext } from "../../contexts/PosTerminalContext";
import { useUser } from "../../customHooks/useUser";

function PosCart({ removeFromCart, updateQuantity, item }: any) {
  const { updateItemDiscount } = usePosTerminalContext();
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between gap-0">
      <div className="font-normal text-[16px] lg:max-w-[60px] xl:max-w-[70px] md:min-w-[100px] lg:min-w-auto break-words ">
        {item.name}
      </div>
      <div className="flex items-center gap-5">
        <button
          className="text-[12px] text-gray-500 cursor-pointer"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="inline size-[10px] text-[#DA1515]" />
        </button>
        <span className="text-[16px] font-semibold">{item.quantity}</span>
        <button
          className="text-[12px] text-gray-500 cursor-pointer"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="inline size-[10px] text-[#08AA08]" />
        </button>
      </div>
      <div className="font-normal text-[16px]">
        {formatCurrency(item.unit_selling_price)}
      </div>
      <div className="font-normal text-[16px]">
        {formatCurrency(calculateItemSubtotal(item))}
      </div>
      <div>
        <input
          type="number"
          className="border py-3 px-2 max-w-[60px] rounded-[8px] no-spinner"
          disabled={user.role === "cashier"}
          value={item.discount || ""}
          onChange={(e) =>
            updateItemDiscount(item.id, parseFloat(e.target.value))
          }
        />
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="cursor-pointer"
      >
        <X className="h-5 w-5 text-[#DA1515]" />
      </button>
    </div>
  );
}

export default PosCart;
