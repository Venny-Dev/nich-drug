import { usePosTerminalContext } from "../../contexts/PosTerminalContext";
import { formatCurrency } from "../../utils/helpers";

function PosProduct({ product }: any) {
  const { addToCart } = usePosTerminalContext();
  // console.log(product);
  return (
    <div className="rounded-[24px] bg-white py-6 px-3 lg:flex lg:items-center lg:justify-between lg:border lg:border-gray-200 lg:shadow-sm">
      <div className="flex items-center  lg:gap-[30px] gap-5">
        <div>
          <img src="/product-img.png" className="size-[60px]" alt="" />
        </div>
        <div>
          <p>{product.name}</p>
          <p>{formatCurrency(product.unit_selling_price)}</p>
        </div>
      </div>

      <button
        className="bg-[#37589F99] w-full rounded-[8px] text-white px-[6px] py-[9px] mt-4 lg:max-w-[100px]"
        onClick={() => addToCart(product)}
      >
        Add
      </button>
    </div>
  );
}

export default PosProduct;
