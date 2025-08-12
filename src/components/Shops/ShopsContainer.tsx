import { useState } from "react";
import { useShops } from "../../customHooks/useShop";
import Shop from "./Shop";
import LoaderPage from "../../ui/LoaderPage";
import EmptyData from "../../ui/EmptyData";
import useFilterData from "../../customHooks/useFilterData";

function ShopsContainer() {
  const { shops, isGettingShops } = useShops();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = useFilterData(shops, searchTerm);

  // prettier-ignore
  if (isGettingShops) return <LoaderPage />

  // console.log(shops);
  return (
    <>
      <div className="relative my-6 max-w-[420px]">
        <input
          type="text"
          placeholder="Search by ID, Name, Location, Email"
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

      <div className="bg-white overflow-x-auto rounded-[24px] border border-[#E4E4E4] ">
        {filteredShops.length === 0 && (
          <EmptyData
            text={
              searchTerm
                ? "No shops match your search"
                : "You have no shops yet. Create a shop to see all available shops"
            }
          />
        )}
        {filteredShops.length > 0 && (
          <div className="min-w-max lg:min-w-0">
            <div className="grid grid-flow-col auto-cols-max gap-3 pl-5">
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[193px]">
                Shop Name
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[133px]">
                Location
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[220px] ml-5">
                Email
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[160px] ml-5">
                Description
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[117px] ml-3">
                Total Product
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[108px]">
                Status
              </p>
              <p className="py-3 text-[12px] font-bold text-[#88918B] min-w-[90px]">
                Action
              </p>
            </div>

            {/* Content */}
            <div className="w-full">
              {filteredShops.map((shop: any) => (
                <Shop key={shop.id} shop={shop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ShopsContainer;
