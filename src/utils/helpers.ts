import { toast } from "react-toastify";
import type { Order } from "./indexedDB";
import type { DateFilterOption, DateRange, OnlineSale } from "./types";
import Cookies from "js-cookie";

export function validateEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

export function capitalizeFirst(word: string) {
  if (!word) return;
  return word[0].toUpperCase() + word.slice(1);
}

export function formatCurrency(amount: number | unknown) {
  if (!amount) return "₦0";
  // console.log(amount);
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(+amount);
}

export function getFormattedDateTime() {
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDate = now.toLocaleDateString("en-US", dateOptions);
  const formattedTime = now.toLocaleTimeString("en-US", timeOptions);
  const result = `${formattedDate}   ${formattedTime}`;
  return result;
}

export const calculateItemSubtotal = (item: any) => {
  const basePrice = +item.unit_selling_price;
  const discountPerUnit = Math.min(item.discount || 0, basePrice);
  const discountedPrice = basePrice - discountPerUnit;
  return discountedPrice * item.quantity;
};

export const calculateItemTotalDiscount = (item: any) => {
  const discountPerUnit = Math.min(
    item.discount || 0,
    +item.unit_selling_price
  );
  return discountPerUnit * item.quantity;
};

export function generateSecureId(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36))
    .join("")
    .slice(0, length);
}

export function timestampToDateString(timestamp: number | undefined): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
}

export function formatDateDayFirst(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function transformOfflineOrdersToSalesFormat(
  offlineOrders: Order[],
  cashierName: string = "Current User", // You might want to get this from user context
  customerName: string = "Walk-in Customer"
): OnlineSale[] {
  const transformedSales: OnlineSale[] = [];

  offlineOrders.forEach((order) => {
    // Use the same order_id for all items in this order
    const orderId = parseInt(order.offline_id) || 0;

    // Transform each item in the order to a separate sale record
    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity - item.discount;

      transformedSales.push({
        amount: itemTotal.toFixed(2),
        cashier_name: cashierName,
        customer: customerName,
        date: timestampToDateString(order.timestamp || Date.now()),
        item_discount: item.discount.toFixed(2),
        item_name: item.product_name || `Product ${item.product_id}`, // Use actual product name if available
        order_id: orderId, // Same order_id for all items in this order
        payment_status: "paid",
        payment_type: order.payment_method.toLowerCase(),
        quantity: item.quantity.toString(),
      });
    });
  });

  return transformedSales;
}

export const handleExportDownload = async (endpoint: string) => {
  const baseUrl = `https://testing.rosymaxpharmacy.com/api/export/${endpoint}`;
  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const filename = endpoint.split("/").pop() || "export";

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download = `${filename}-export.xlsx`;
    document.body.appendChild(a);
    a.click();
    toast.success("Export successful");

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error: any) {
    console.error("Export failed:", error);
    toast.error(error.message || "Export failed");
  }
};

export function getDateRange(
  option: DateFilterOption,
  customRange?: DateRange
): DateRange {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  switch (option) {
    case 1: // Today
      return {
        from: startOfToday,
        to: endOfToday,
      };

    case 2: // Yesterday
      const yesterday = new Date(startOfToday);
      yesterday.setDate(yesterday.getDate() - 1);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      return {
        from: yesterday,
        to: endOfYesterday,
      };

    case 7: // Last 7 days
      const sevenDaysAgo = new Date(startOfToday);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return {
        from: sevenDaysAgo,
        to: endOfToday,
      };

    case 30: // Last 30 days
      const thirtyDaysAgo = new Date(startOfToday);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return {
        from: thirtyDaysAgo,
        to: endOfToday,
      };

    case 60: // Last Month (assuming previous calendar month)
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      return {
        from: lastMonth,
        to: lastDayOfLastMonth,
      };

    case "custom": // Custom date range
      if (!customRange) {
        throw new Error(
          'Custom date range is required when option is "custom"'
        );
      }

      // Normalize custom range for same day scenarios
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);

      // If it's the same day, ensure proper time boundaries
      if (fromDate.toDateString() === toDate.toDateString()) {
        const normalizedFrom = new Date(fromDate);
        normalizedFrom.setHours(0, 0, 0, 0); // Start of day

        const normalizedTo = new Date(toDate);
        normalizedTo.setHours(23, 59, 59, 999); // End of day

        return {
          from: normalizedFrom,
          to: normalizedTo,
        };
      }
      return customRange;

    default:
      return {
        from: startOfToday,
        to: endOfToday,
      };
  }
}

export function isDateInRange(
  transactionDate: string,
  dateRange: DateRange
): boolean {
  const transDate = new Date(transactionDate);
  const fromDate = new Date(dateRange.from);
  const toDate = new Date(dateRange.to);

  // Check if from and to dates are the same day (ignoring time)
  const isSameDay = fromDate.toDateString() === toDate.toDateString();

  if (isSameDay) {
    // Same day: check if transaction date matches that specific day
    return transDate.toDateString() === fromDate.toDateString();
  } else {
    // Different dates: use range filtering with proper time boundaries
    const fromDateStart = new Date(fromDate);
    fromDateStart.setHours(0, 0, 0, 0); // Start of from date

    const toDateEnd = new Date(toDate);
    toDateEnd.setHours(23, 59, 59, 999); // End of to date

    return transDate >= fromDateStart && transDate <= toDateEnd;
  }
}

export function getDateDisplayText(
  curOption: DateFilterOption,
  customDateRange?: DateRange
): string {
  switch (curOption) {
    case 1:
      return "Today";

    case 2:
      return "Yesterday";

    case 7:
      return "Last 7 Days";

    case 30:
      return "Last 30 Days";

    case 60:
      return "Last 60 Days";

    case "custom":
      if (!customDateRange) {
        return "Custom Date Range";
      }

      // Format the custom date range
      const fromDate = customDateRange.from.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const toDate = customDateRange.to.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Check if it's the same date
      if (fromDate === toDate) {
        return fromDate;
      }

      return `${fromDate} - ${toDate}`;

    default:
      return "Today";
  }
}

export function calculatePaginationButtons(
  pageCount: number,
  currentPage: number
) {
  const paginationButtons: (string | number)[] = [];

  if (pageCount <= 4) {
    // Show all pages if the total number is 4 or fewer
    for (let i = 1; i <= pageCount; i++) paginationButtons.push(i);
  } else if (window.innerWidth <= 640) {
    // Small screen logic
    if (currentPage === 1) {
      // On the first page: 1, 2, ..., lastPage
      paginationButtons.push(1, 2, "...", pageCount);
    } else if (currentPage === 2) {
      // On the second page: 2, 3, ..., lastPage
      paginationButtons.push(2, 3, "...", pageCount);
    } else if (currentPage >= pageCount - 1) {
      // Near the last page: ..., pageCount-2, pageCount-1, lastPage
      paginationButtons.push("...", pageCount - 2, pageCount - 1, pageCount);
    } else {
      // Middle pages: ..., currentPage, currentPage+1, ..., lastPage
      paginationButtons.push("...", currentPage, currentPage + 1, pageCount);
    }
  } else {
    // Default: Show all pages for larger screens
    for (let i = 1; i <= pageCount; i++) paginationButtons.push(i);
  }

  return paginationButtons;
}

const formatDateForProfit = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get date range based on option
export const getDateRangeForProfit = (
  option: number | string,
  customDateRange: { from: Date | null; to: Date | null }
) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // console.log(customDateRange);

  switch (option) {
    case 1: // Today
      return {
        from: formatDateForProfit(today),
        to: formatDateForProfit(today),
      };

    case 2: // Yesterday
      return {
        from: formatDateForProfit(yesterday),
        to: formatDateForProfit(yesterday),
      };

    case 7: // Last 7 Days
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6); // -6 to include today
      return {
        from: formatDateForProfit(sevenDaysAgo),
        to: formatDateForProfit(today),
      };

    case 30: // Last 30 Days
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29); // -29 to include today
      return {
        from: formatDateForProfit(thirtyDaysAgo),
        to: formatDateForProfit(today),
      };

    case 60: // Last Month (assuming previous calendar month)
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      return {
        from: formatDateForProfit(lastMonth),
        to: formatDateForProfit(lastDayOfLastMonth),
      };

    case "custom": // Custom range
      if (customDateRange.from && customDateRange.to) {
        return {
          from: formatDateForProfit(customDateRange.from),
          to: formatDateForProfit(customDateRange.to),
        };
      }
      // Fallback to today if custom dates are not set
      return {
        from: formatDateForProfit(today),
        to: formatDateForProfit(today),
      };

    default:
      return {
        from: formatDateForProfit(today),
        to: formatDateForProfit(today),
      };
  }
};

export const decodeJWTPayload = (token: string): any | null => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Get the payload (middle part)
    const payload = parts[1];

    // Convert base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Decode and parse
    const decoded = JSON.parse(atob(padded));

    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};
