import { useState } from "react";
import { useProducts } from "../../customHooks/useProducts";
import EmptyData from "../../ui/EmptyData";
import LoaderPage from "../../ui/LoaderPage";
import type { ProductTypes } from "../../utils/types";
import Product from "./Product";
import useFilterData from "../../customHooks/useFilterData";
import usePaginateData from "../../customHooks/usePaginateData";
import Pagination from "../../ui/Pagination";

function ProductContainer() {
  const { products, isGettingProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useFilterData(products, searchTerm);
  const { paginatedData, isPagination, pageCount } =
    usePaginateData(filteredProducts);

  // console.log(isGettingProducts);

  // prettier-ignore
  if (isGettingProducts) return <LoaderPage />

  // console.log(products);
  return (
    <>
      <div className="relative my-6 max-w-[420px]">
        <input
          type="text"
          placeholder="Search by ID, Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full  bg-white text-[#88918B] py-3 pl-[35px] pr-3 rounded-[8px]  focus:outline-none text-[12px] font-normal"
        />
        <img
          src="/search-icon.png"
          className="absolute top-4 size-3 left-3"
          alt=""
        />
      </div>
      <div
        className={`bg-white overflow-x-auto rounded-t-[24px] border border-[#E4E4E4] ${
          !isPagination ? "rounded-b-[24px]" : ""
        }`}
      >
        {paginatedData.length === 0 && (
          <EmptyData text="No product found, please add a product" />
        )}
        {paginatedData.length > 0 && (
          <div className="min-w-max lg:min-w-0">
            <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px]">
                Bar code
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[133px]">
                Name
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px] ml-5">
                Category
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[110px] ml-3">
                Product Type
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[60px]">
                Stock
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[140px]">
                Unit Purchase Price
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[128px]">
                Unit Selling Price
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
                Action
              </p>
            </div>

            {/* Content */}
            <div className="w-full">
              {paginatedData.map((product: ProductTypes) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      {isPagination && <Pagination pageCount={pageCount} />}
    </>
  );
}

export default ProductContainer;
