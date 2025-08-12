import SalesMetrics from "../components/Dashboard/SalesMetrics";
import SalesMetricsMobile from "../components/Dashboard/SalesMetricsMobile";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import InventoryStatus from "../components/Dashboard/InventoryStatus";
import TopSelling from "../components/Dashboard/TopSelling";
import { lazy, Suspense } from "react";
// import RevenueChart from "../components/Dashboard/RevenueChart";
const RevenueChart = lazy(() => import("../components/Dashboard/RevenueChart"));

function Dashboard() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="font-bold text-[16px]">Nich Drugs</h1>
        <p className="text-[#88918B] font-normal text-[12px] mt-[10px]">
          Hi, Admin. Nice to see you again
        </p>
      </div>

      <div className="mb-8 lg:flex lg:w-full lg:gap-6 ">
        <SalesMetrics />
        <SalesMetricsMobile />
        <RecentTransactions />
      </div>

      <div className="grid grid-cols-1  gap-6 mb-8 lg:flex lg:items-cente ">
        <TopSelling />
        <InventoryStatus />
      </div>

      <div className="grid grid-cols-1 gap-6 ">
        <Suspense fallback={<div>Loading...</div>}>
          <RevenueChart />
        </Suspense>
      </div>
    </main>
  );
}

export default Dashboard;
