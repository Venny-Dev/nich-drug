import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PosTerminal = lazy(() => import("./pages/PosTerminal"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Purchases = lazy(() => import("./pages/Purchases"));
const Products = lazy(() => import("./pages/Products"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));
const Category = lazy(() => import("./pages/Category"));
const TotalSales = lazy(() => import("./pages/TotalSales"));
const Shops = lazy(() => import("./pages/Shops"));

import AppLayout from "./ui/AppLayout";
import Signin from "./components/Auth/Signin";
import AuthLayout from "./ui/AuthLayout";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import { ToastContainer, Zoom } from "react-toastify";
import LoaderFull from "./ui/LoaderFull";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<LoaderFull />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pos-terminal" element={<PosTerminal />} />
              <Route path="shops" element={<Shops />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Category />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="users" element={<Users />} />
              <Route path="total-sales" element={<TotalSales />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Signin />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </div>
  );
}

export default App;
