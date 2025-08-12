import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import { ShopProvider } from "../contexts/ShopContext";
import { PosTerminalProvider } from "../contexts/PosTerminalContext";
import { SidebarProvider, useSidebarContext } from "../contexts/SidebarContext";
import ProtectedRoute from "./ProtectedRoute";
import useTokenRefreshManager from "../customHooks/useTokenRefreshManager";
import { useEffect } from "react";

function AppLayoutContent() {
  const { isOpen } = useSidebarContext();
  const { startTokenRefresh } = useTokenRefreshManager();

  useEffect(() => {
    startTokenRefresh();
  }, []);

  return (
    <div className="bg-primary-light flex h-screen overflow-hidden bg-[#E5E5E5]">
      <Sidebar />
      <div
        className={`flex flex-col h-full flex-1 overflow-hidden transition-all duration-300 ${
          isOpen ? "md:ml-48 xl:ml-60" : "ml-0"
        }`}
      >
        <Header />
        <div className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <ShopProvider>
          <PosTerminalProvider>
            <AppLayoutContent />
          </PosTerminalProvider>
        </ShopProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

export default AppLayout;
