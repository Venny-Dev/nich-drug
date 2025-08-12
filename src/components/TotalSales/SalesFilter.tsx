import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import DateRange from "./DateRange";
import { useUser, useUsers } from "../../customHooks/useUser";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Option, SalesFilterProps, UserTypes } from "../../utils/types";
import { useShopContext } from "../../contexts/ShopContext";
import { useExportTotalSales } from "../../customHooks/useExports";
import ExcessCash from "./ExcessCash";

function SalesFilter({
  options,
  setOption,
  option: curOption,
  customDateRange,
  setCustomDateRange,
  paymentMethod,
  setPaymentMethod,
  selectedCashier,
  setSelectedCashier,
  isDialogOpen,
  setIsDialogOpen,
}: SalesFilterProps) {
  const { user } = useUser();
  const { users, isGettingUsers } = useUsers();
  const { exportTotalSales, isExportingTotalSales } = useExportTotalSales();

  const { activeShop } = useShopContext();

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExcessOpen, setIsExcessOpen] = useState(false);

  let shopUsers;
  if (!isGettingUsers && user.role !== "cashier") {
    shopUsers = users.filter(
      (user: UserTypes) =>
        user.shops.includes("All Shops") ||
        user.shops.includes(activeShop?.name || "")
    );
  }

  // console.log(curOption);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[16px] font-bold">Total Sales</p>
        <div className="space-x-3">
          <Dialog open={isExcessOpen} onOpenChange={setIsExcessOpen}>
            <DialogTrigger
              className="bg-[#37589F99] p-3 text-white rounded-[8px] cursor-pointer"
              role="button"
            >
              Excess Cash
            </DialogTrigger>
            <DialogContent className="bg-white border-none max-w-md w-full">
              <DialogHeader>
                <DialogTitle>
                  {user.role === "cashier" ? "Add Excess Cash" : "Excess Cash"}
                </DialogTitle>
              </DialogHeader>
              <ExcessCash
                setIsOpen={setIsExcessOpen}
                curOption={curOption}
                customDateRange={customDateRange}
              />
            </DialogContent>
          </Dialog>
          {user.role !== "cashier" && (
            <button
              className="bg-[#37589F99] p-3 text-white rounded-[8px]"
              onClick={() => exportTotalSales()}
              disabled={isExportingTotalSales}
            >
              {isExportingTotalSales ? "Exporting..." : "Export"}
            </button>
          )}
        </div>
      </div>

      <div className="lg:flex lg:items-center gap-[20px] md:mt-6">
        <div className="md:flex rounded-[8px] bg-white justify-between lg:max-w-[470px] xl:max-w-full hidden text-[12px] font-medium relative">
          {options.map((option: Option) =>
            option.value === "custom" ? (
              <Dialog
                key={option.value}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                <DialogTrigger asChild>
                  <button
                    className={`py-[11px] text-nowrap px-3 w ${
                      option.value === curOption
                        ? "bg-[#37589F99] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setOption(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[348px]">
                  <DialogHeader>
                    <DialogTitle>Select Date Range</DialogTitle>
                  </DialogHeader>
                  <DateRange
                    setIsDialogOpen={setIsDialogOpen}
                    customDateRange={customDateRange}
                    setCustomDateRange={setCustomDateRange}
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <button
                key={option.value}
                className={`py-[11px] text-nowrap px-3 w ${
                  option.value === curOption ? "bg-[#37589F99] text-white" : ""
                }`}
                onClick={() => setOption(option.value)}
              >
                {option.label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex lg:justify-end items-center gap-[7px] mt-6 md:gap-7  lg:gap-3 lg:w-full lg:mt-3">
        {user.role !== "cashier" && (
          <div className="flex-1 sm:flex items-center sm:bg-white sm:rounded-[8px] lg:w-full  lg:max-w-[185px]">
            <div className="py-[11px] pl-2 rounded-l-[8px] hidden sm:inline-flex text-[12px] font-medium">
              Cashier
            </div>
            <select
              name=""
              id=""
              className="bg-white py-[11px] text-[12px] text-[#88918B] w-full px-3 rounded-[8px] "
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
            >
              <option value="all" className="hidden sm:block">
                All
              </option>
              {!isGettingUsers &&
                shopUsers?.map((user: UserTypes) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex-1 sm:flex items-center sm:bg-white sm:rounded-[8px]  lg:max-w-[243px]">
          <div className="py-[11px] pl-2 rounded-l-[8px] hidden sm:inline-flex text-[12px] font-medium lg:text-nowrap w-full">
            Payment method
          </div>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent className="bg-white py-[11px] text-[12px] text-[#88918B] w-full px-3 rounded-[8px] ">
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default SalesFilter;
