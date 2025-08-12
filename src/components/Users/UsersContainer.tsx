import { useState } from "react";
import { useUsers } from "../../customHooks/useUser";
import EmptyData from "../../ui/EmptyData";
import LoaderPage from "../../ui/LoaderPage";
import type { UserTypes } from "../../utils/types";
import User from "./User";
import useFilterData from "../../customHooks/useFilterData";
import usePaginateData from "../../customHooks/usePaginateData";
import Pagination from "../../ui/Pagination";

function UsersContainer() {
  const { users, isGettingUsers, error, isError } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useFilterData(users, searchTerm);

  const { paginatedData, pageCount, isPagination } =
    usePaginateData(filteredUsers);

  if (isGettingUsers) {
    // prettier-ignore
    return <LoaderPage />
  }

  if (isError) {
    // console.error("Error fetching users:", error);
    return (
      <div className="bg-white p-8 rounded-[24px] border border-[#E4E4E4] text-center">
        <p className="text-red-500">
          Error loading users: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  // console.log("UsersContainer - users data:", users);
  return (
    <>
      <div className="relative my-6 max-w-[420px]">
        <input
          type="text"
          placeholder="Search by ID, Name, Email"
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
        <div className="min-w-max lg:min-w-0">
          <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[223px]">
              Name
            </p>
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[200px]">
              Email
            </p>
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[100px] ml-5">
              Role
            </p>
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[150px] ml-5">
              Shop(s)
            </p>
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[118px]">
              Status
            </p>
            <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
              Action
            </p>
          </div>

          <div className="w-full">
            {(!paginatedData || paginatedData?.length === 0) && (
              <EmptyData
                text={
                  searchTerm
                    ? "No users match your search"
                    : "No user found, Add a user"
                }
              />
            )}
            {paginatedData &&
              paginatedData?.length > 0 &&
              paginatedData?.map((user: UserTypes) => (
                <User key={user.id} user={user} />
              ))}
          </div>
        </div>
      </div>
      {isPagination && <Pagination pageCount={pageCount} />}
    </>
  );
}

export default UsersContainer;
