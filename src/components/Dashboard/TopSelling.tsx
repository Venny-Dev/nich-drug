import { useTopSellingProducts } from "../../customHooks/useDashboards";
import EmptyData from "../../ui/EmptyData";
import LoaderSpinner from "../../ui/LoaderSpinner";
import { capitalizeFirst } from "../../utils/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Progress } from "../ui/progress";

function TopSelling() {
  const { topSellingProducts, isGettingTopSellingProducts } =
    useTopSellingProducts();

  return (
    <Card className="bg-white rounded-[24px] border-[#88918B4D] shadow-none lg:flex-1">
      <CardHeader>
        <CardTitle className="text-[12px] font-semibold text-[#88918B]">
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start font-semibold text-[12px] text-[#88918B] mb-5 lg:justify-between lg:mr-36">
          <p className="font-semibold text-[12px] text-[#88918B]">Product</p>
          <p>Best-Selling</p>
        </div>
        <div className="space-y-4">
          {isGettingTopSellingProducts && (
            <div className="flex items-center justify-center mt-5">
              <LoaderSpinner className="w-[50px]" />
            </div>
          )}
          {!isGettingTopSellingProducts && topSellingProducts.length === 0 && (
            <EmptyData text="No top selling products found" />
          )}
          {!isGettingTopSellingProducts &&
            topSellingProducts.length > 0 &&
            topSellingProducts
              .slice(0, 3)
              .map((product: { name: string; qty: number }, index: number) => (
                <div
                  key={index}
                  className="space-y-2 flex itmes-start justify-between gap-10 items-start"
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center ">
                      <img src="/product-icon.png" alt="" className="mr-3" />
                      <span className="font-medium">
                        {capitalizeFirst(product.name)}
                      </span>
                    </div>
                    {/* <Progress
                  value={75}
                  className="h-2  bg-[#37589F99] w-fit"
                  // style={
                  //   {
                  //     "--progress-background": "#e5e7eb", // bg color
                  //     "--progress-foreground": "#3b82f6", // progress bar color
                  //   } as React.CSSProperties
                  // }
                /> */}
                  </div>
                  <p className="font-normal text-[12px] w-full text-center">
                    {product.qty}
                  </p>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopSelling;
