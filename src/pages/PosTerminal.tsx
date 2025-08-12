import TabNavigation from "../components/PosTerminal/TabNavigation";
import PosProducts from "../components/PosTerminal/PosProducts";
import MobileCartView from "../components/PosTerminal/MobileCartView";
import DesktopCartView from "../components/PosTerminal/DesktopCartView";
import { usePosTerminalContext } from "../contexts/PosTerminalContext";
import useCurrentTime from "../customHooks/useCurrentTime";

function PosTerminal() {
  const { showMobileCart } = usePosTerminalContext();
  const time = useCurrentTime();

  if (showMobileCart) {
    return <MobileCartView />;
  }

  return (
    <div className="max-w mx-to p-6  min-h-screen md:pt-0 md:px-0">
      <div>
        <div className="">
          <div className="flex items-center justify-between mb-4 md:bg-white md:mb-0">
            <h1 className="text-[16px] font-bold md:hidden">POS Terminal</h1>
          </div>
        </div>
      </div>

      <div className="md:flex items-center justify-between mb-6 md:bg-white md:px-6 md:pb-5 xl:relative xl:z-30">
        <TabNavigation />
        <p className="text-[24px] font-bold text-black hidden md:block">
          {time}
        </p>
      </div>

      <div className="lg:flex gap-6 md:px-6">
        <PosProducts />
        <DesktopCartView />
      </div>
    </div>
  );
}

export default PosTerminal;
