import { useSearchParams } from "react-router";
import { PAGE_SIZE } from "../utils/constants";

function usePaginateData(filteredData: any) {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const from = (page - 1) * PAGE_SIZE;
  const to = page * PAGE_SIZE;

  const paginatedData =
    filteredData?.length > 10 ? filteredData?.slice(from, to) : filteredData;

  const totalItems = filteredData.length;
  const pageCount = Math.ceil(totalItems / PAGE_SIZE);
  const isPagination = pageCount > 1;

  return {
    paginatedData,
    pageCount,
    isPagination,
  };
}

export default usePaginateData;
