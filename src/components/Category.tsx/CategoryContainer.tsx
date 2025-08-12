import { useState } from "react";
import { useCategories } from "../../customHooks/useCategories";
import EmptyData from "../../ui/EmptyData";
import LoaderPage from "../../ui/LoaderPage";
import CategoryItem from "./CategoryItem";
import useFilterData from "../../customHooks/useFilterData";
import usePaginateData from "../../customHooks/usePaginateData";
import Pagination from "../../ui/Pagination";

function CategoryContainer() {
  const { categories, isGettingCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useFilterData(categories, searchTerm);

  const { paginatedData, isPagination, pageCount } =
    usePaginateData(filteredCategories);

  // prettier-ignore
  if (isGettingCategories) return <LoaderPage />

  // console.log(categories);
  return (
    <>
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
          <EmptyData text="No Category Found, Please add a category" />
        )}
        {paginatedData.length > 0 && (
          <div className="min-w-max lg:min-w-0">
            <div className="grid grid-cols-5 gap-3 pl-5 ">
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px]">
                Category Name
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[133px]">
                Product Count
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[133px]">
                Desription
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px] ml-5">
                Status
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
                Action
              </p>
            </div>

            {/* Content */}
            <div className="w-full">
              {paginatedData.map((category: any) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isPagination && <Pagination pageCount={pageCount} />}
    </>
  );
}

export default CategoryContainer;
