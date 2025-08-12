import { useState } from "react";
import EmptyData from "../../ui/EmptyData";
import Sale from "./Sale";
import useFilterData from "../../customHooks/useFilterData";
import type { OnlineSale } from "../../utils/types";
import usePaginateData from "../../customHooks/usePaginateData";
import Pagination from "../../ui/Pagination";

function SalesContainer({
  salesData,
  allSalesData,
}: {
  salesData: any;
  allSalesData: OnlineSale[] | undefined;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = useFilterData(salesData, searchTerm);

  const { paginatedData, isPagination, pageCount } =
    usePaginateData(filteredSales);

  // console.log(salesData);

  return (
    <div className="mt-[50px]">
      <div className="relative my-6 max-w-[420px]">
        <input
          type="text"
          placeholder="Search by ID, Name"
          className="w-full  bg-white text-[#88918B] py-3 pl-[35px] pr-3 rounded-[8px]  focus:outline-none text-[12px] font-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <EmptyData
            text={searchTerm ? "No sales found" : "You have no sales data yet."}
          />
        )}
        {paginatedData.length > 0 && (
          <div className="min-w-max lg:min-w-0">
            <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[120px]">
                Date & Time
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[80px]">
                ID
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[120px] ml-5">
                Payment Type
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[147px] ml-3">
                Total Amount
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[180px]">
                Item Sold
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[120px]">
                Payment Status
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
                View Receipt
              </p>
            </div>

            {/* Content */}
            <div className="w-full">
              {paginatedData.map((sale: any, index: number) => (
                <Sale key={index} sale={sale} allSalesData={allSalesData} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isPagination && <Pagination pageCount={pageCount} />}
    </div>
  );
}

export default SalesContainer;
