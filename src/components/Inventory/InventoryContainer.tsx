import { useMemo, useState } from "react";
import { useInventories } from "../../customHooks/useInventories";
import LoaderPage from "../../ui/LoaderPage";
import type { InventoryTypes } from "../../utils/types";
import Inventory from "./Inventory";
import useFilterData from "../../customHooks/useFilterData";
import EmptyData from "../../ui/EmptyData";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "../ui/select";
import Pagination from "../../ui/Pagination";
import usePaginateData from "../../customHooks/usePaginateData";

function InventoryContainer() {
  const { inventories, isGettingInventories } = useInventories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // console.log(inventories);

  const searchedData = useFilterData(inventories, searchTerm);

  const filteredData = useMemo(() => {
    if (selectedFilter === "all") return searchedData;
    if (selectedFilter === "instock")
      return searchedData.filter(
        (inventory: InventoryTypes) => inventory.status === "in stock"
      );
    if (selectedFilter === "outofstock")
      return searchedData.filter(
        (inventory: InventoryTypes) => inventory.status === "out of stock"
      );
    if (selectedFilter === "lowstock")
      return searchedData.filter(
        (inventory: InventoryTypes) => inventory.status === "low stock"
      );
  }, [selectedFilter, searchedData]);

  const { paginatedData, pageCount, isPagination } =
    usePaginateData(filteredData);

  if (isGettingInventories) return <LoaderPage />;

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="relative my-6 max-w-[420px] w-full">
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

        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="instock">In Stock</SelectItem>
              <SelectItem value="outofstock">Out of Stock</SelectItem>
              <SelectItem value="lowstock">Low Stock</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className={`bg-white overflow-x-auto rounded-t-[24px] border border-[#E4E4E4] ${
          !isPagination ? "rounded-b-[24px]" : ""
        }`}
      >
        <div className="min-w-max lg:min-w-0">
          {(!paginatedData || paginatedData?.length === 0) && (
            <EmptyData
              text={
                searchTerm || selectedFilter !== "all"
                  ? "No Inventory match your search"
                  : "No Inventory found, Add a Inventory"
              }
            />
          )}
          {paginatedData.length > 0 && (
            <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[193px]">
                Product
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[133px]">
                Quantity
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[170px] ml-5">
                Status
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[167px] ml-3">
                Description
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
                Action
              </p>
            </div>
          )}

          {/* Content */}
          <div className="w-full">
            {paginatedData.map((inventory: InventoryTypes) => (
              <Inventory key={inventory.product_id} inventory={inventory} />
            ))}
          </div>
        </div>
      </div>
      {isPagination && <Pagination pageCount={pageCount} />}
    </>
  );
}

export default InventoryContainer;
