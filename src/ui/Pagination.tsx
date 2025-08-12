import { useSearchParams } from "react-router";
import { calculatePaginationButtons } from "../utils/helpers";

function Pagination({ pageCount }: { pageCount: number }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set("page", next.toString());
    setSearchParams(searchParams);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", prev.toString());
    setSearchParams(searchParams);
  }
  const paginationButtons = calculatePaginationButtons(pageCount, currentPage);

  return (
    <div className="py-6 rounded-b-[24px] px-3 flex items-center justify-between bg-white">
      <button
        className="flex items-center px-4 py-[9.5px] gap-4 border border-primaryBeige-500 rounded-lg flex-shrink-0"
        disabled={currentPage === 1}
        onClick={prevPage}
      >
        <img src="/icon-left.png" alt="icon-left" />
        <p className="text-[12px] font-medium text-[#88918B] hidden md:block">
          Previous
        </p>
      </button>

      <div className="flex items-center gap-2">
        {paginationButtons.map((page, index) => (
          <button
            key={index}
            className={`px-4 py-[6px] gap-4  rounded-full  font-normal text-primaryGrey-900 ${
              page === currentPage
                ? "bg-[#37589F99] text-white"
                : "bg-white text-[#88918B]"
            }`}
            onClick={() => {
              if (typeof page === "number") {
                searchParams.set("page", page.toString());
                setSearchParams(searchParams);
              }
            }}
            disabled={typeof page !== "number"}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="flex items-center px-4 py-[9.5px] gap-4 border border-primaryBeige-500 rounded-lg cursor-pointer flex-shrink-0"
        disabled={currentPage === pageCount}
        onClick={nextPage}
      >
        <p className="text-[12px] font-medium text-[#88918B] hidden md:block">
          Next
        </p>
        <img src="/icon-right.png" alt="icon-left" />
      </button>
    </div>
  );
}

export default Pagination;
