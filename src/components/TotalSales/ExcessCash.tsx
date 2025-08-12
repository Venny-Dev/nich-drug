import { useCallback, useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useShopContext } from "../../contexts/ShopContext";
import {
  useAddExcessCash,
  useGetExcessCash,
} from "../../customHooks/useExcessCash";
import { useUser, useUsers } from "../../customHooks/useUser";
import LoaderSpinner from "../../ui/LoaderSpinner";
import Loader from "../../ui/Loader";
import EmptyData from "../../ui/EmptyData";
import {
  formatCurrency,
  getDateDisplayText,
  getDateRange,
  isDateInRange,
} from "../../utils/helpers";

import type { DateFilterOption, DateRange, UserTypes } from "../../utils/types";

interface ExcessCashProps {
  setIsOpen: (isOpen: boolean) => void;
  curOption: number | string;
  customDateRange: Record<"from" | "to", Date | null>;
}

function ExcessCash({
  setIsOpen,
  curOption,
  customDateRange,
}: ExcessCashProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      selectedUser: "",
      amount: "",
    },
  });

  const { addExcessCash, isAddingExcessCash } = useAddExcessCash();
  const { excessCash, isGettingExcessCash } = useGetExcessCash();
  const { user } = useUser();
  const { users, isGettingUsers } = useUsers();
  const { activeShop } = useShopContext();

  const [cashier, setCashier] = useState<string>("all");

  useEffect(() => {
    if (user.role === "cashier") {
      setCashier(user.name);
    }
  }, [user.role]);

  // Get an array of all users and their total excess amount for the selected time period
  const getAllUsersTotalsForTimePeriod = useCallback(() => {
    if (!excessCash) return [] as any[];

    const dateRange =
      curOption === "custom"
        ? getDateRange(curOption, customDateRange as DateRange)
        : getDateRange(curOption as DateFilterOption);

    // Filter transactions by date first
    const filteredTransactions = excessCash.filter((transaction: any) =>
      isDateInRange(transaction.date, dateRange)
    );

    const userTotals = filteredTransactions.reduce(
      (acc: Record<string, number>, transaction: any) => {
        const userName = transaction.user.name;
        const amount = parseFloat(transaction.amount);

        acc[userName] = (acc[userName] || 0) + amount;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(userTotals).map(([name, amount]) => ({
      name,
      amount,
    }));
  }, [excessCash, curOption, customDateRange]);

  //   Gets total excess cash for the selected time period
  const totalExcessCashForTimePeriod = getAllUsersTotalsForTimePeriod()?.reduce(
    (acc: number, curr: any) => acc + Number(curr.amount),
    0
  );
  // Gets total excess cash for a selected user for the selected time period
  const getTotalUserExcessForTimePeriod = useCallback(() => {
    const userTotals = getAllUsersTotalsForTimePeriod();
    return userTotals.find((user) => user.name === cashier);
  }, [cashier, getAllUsersTotalsForTimePeriod]);

  //   console.log(excessCash);

  let shopUsers: UserTypes[] = [];
  if (!isGettingUsers) {
    shopUsers = users.filter((user: UserTypes) =>
      user.shops.includes(activeShop?.name || "")
    );
  }

  function onSubmit(data: any) {
    if (!navigator.onLine)
      return toast.error("You must be online to add excess cash");

    if (user.role === "cashier") {
      addExcessCash(
        { amount: Number(data.amount) },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    }
    // console.log(data.selectedUser);

    if (user.role !== "cashier") {
      const user = shopUsers?.find(
        (user: UserTypes) => user.name === data.selectedUser
      );
      const dataApi = {
        amount: Number(data.amount),
        cashier_id: user?.id,
        // date: Date.now().toString(),
      };
      //   console.log(dataApi);
      addExcessCash(dataApi, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    }
  }

  return (
    <div>
      {user.role !== "cashier" && isGettingExcessCash && (
        <div className="flex items-center justify-center mx-auto">
          <LoaderSpinner className="w-[50px]" />
        </div>
      )}
      {user.role !== "cashier" &&
        !isGettingExcessCash &&
        excessCash.length === 0 && (
          <div className="flex items-center justify-center mx-auto">
            <EmptyData text="No excess cash found" />
          </div>
        )}

      {user.role !== "cashier" &&
        !isGettingExcessCash &&
        excessCash.length > 0 && (
          <div className="">
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-medium">Filter By Cashier:</p>
              <Select value={cashier} onValueChange={setCashier}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent className="bg-white py-[11px] text-[12px] text-[#88918B] w-full px-3 rounded-[8px] ">
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    {getAllUsersTotalsForTimePeriod().map((user) => (
                      <SelectItem value={user.name} key={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      <h3 className="text-[20px] font-medium block mt-5">
        Total Excess Cash for{" "}
        {getDateDisplayText(
          curOption as DateFilterOption,
          customDateRange as DateRange
        )}
        :{" "}
        {cashier === "all"
          ? formatCurrency(totalExcessCashForTimePeriod)
          : formatCurrency(getTotalUserExcessForTimePeriod()?.amount)}
      </h3>

      {
        <form action="" onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="">
            <label className="text-[16px] font-normal block">
              Enter Excess Cash Amount
            </label>
            <input
              type="number"
              className="border border-[#88918B4D] px-[14px] py-[10px] rounded-[8px] w-full mt-1"
              placeholder="Enter excess cash amount"
              {...register("amount", {
                required: "Amount is required",
                validate: (value) =>
                  Number(value) > 0 || "Amount must be greater than 0",
              })}
              disabled={isAddingExcessCash}
            />
            {errors.amount && (
              <span className="text-red-500 text-xs">
                {String(errors.amount.message)}
              </span>
            )}
          </div>
          {user.role !== "cashier" && (
            <div className="mt-4">
              <label className="text-[16px] font-normal block">
                Select User
              </label>
              <Controller
                control={control}
                name="selectedUser"
                rules={{ required: "User is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent className="bg-white py-[11px] text-[12px] text-[#88918B] w-full px-3 rounded-[8px] ">
                      <SelectGroup>
                        {!isGettingUsers &&
                          shopUsers?.map((user: UserTypes) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedUser && (
                <span className="text-red-500 text-xs">
                  {String(errors.selectedUser.message)}
                </span>
              )}
            </div>
          )}

          <button
            className="bg-[#37589F99] p-3 text-white rounded-[8px] w-full mt-5 flex items-center justify-center"
            disabled={isAddingExcessCash}
          >
            {isAddingExcessCash ? <Loader /> : " Add Excess Cash"}
          </button>
        </form>
      }
    </div>
  );
}

export default ExcessCash;
