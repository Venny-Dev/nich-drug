import { Minus, Plus, X } from "lucide-react";
import { usePosTerminalContext } from "../../contexts/PosTerminalContext";

function PosCartMobile({ removeFromCart, updateQuantity, item }: any) {
  const { updateItemDiscount } = usePosTerminalContext();
  return (
    <div className=" items-center md:hidden gap-7 grid grid-flow-col auto-cols-max">
      <div className="font-normal text-[16px] min-w-[80px] max-w-[130px] text-wrap break-words">
        {item.name}
      </div>
      <div className="flex items-center gap-4 min-w-[80px]">
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
      <div className="font-normal text-[16px]"> ₦{item.unit_selling_price}</div>
      <div className="font-normal text-[16px]">
        ₦{item.unit_selling_price * item.quantity}
      </div>
      <div>
        <input
          type="text"
          className="border py-3 px-2 max-w-[52px] rounded-[8px]"
          value={item.discount || ""}
          onChange={(e) =>
            updateItemDiscount(item.id, parseFloat(e.target.value))
          }
        />
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="cursor-pointer min-w-[50px]"
      >
        <X className="h-5 w-5 text-[#DA1515]" />
      </button>
    </div>
  );
}

export default PosCartMobile;
