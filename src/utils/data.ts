import {
  LayoutDashboard,
  Monitor,
  Store,
  TrendingUp,
  Package,
  Archive,
  Users,
  Settings,
} from "lucide-react";
import type { Option } from "./types";

export const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Monitor, label: "POS Terminal", to: "/pos-terminal" },
  { icon: TrendingUp, label: "Total Sales", to: "/total-sales" },
  { icon: Store, label: "Shops", to: "/shops" },
  {
    icon: Package,
    label: "Products",
    chidren: [
      { label: "All Products", to: "/products" },
      { label: "Category", to: "/categories" },
    ],
  },
  { icon: Archive, label: "Inventory", to: "/inventory" },
  { icon: Users, label: "Users & Roles", to: "/users" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export const products = {
  Drinks: [
    { id: 1, name: "Maltina", price: 25.0, image: "🥤" },
    { id: 2, name: "Coke", price: 25.0, image: "🥤" },
    { id: 3, name: "Sprite", price: 25.0, image: "🥤" },
    { id: 4, name: "Fanta", price: 25.0, image: "🥤" },
  ],
  Drugs: [
    { id: 5, name: "Paracetamol", price: 15.0, image: "💊" },
    { id: 6, name: "Ibuprofen", price: 20.0, image: "💊" },
    { id: 7, name: "Aspirin", price: 18.0, image: "💊" },
  ],
  Bakery: [
    { id: 8, name: "Bread", price: 12.0, image: "🍞" },
    { id: 9, name: "Cake", price: 35.0, image: "🍰" },
    { id: 10, name: "Cookies", price: 8.0, image: "🍪" },
  ],
  Snacks: [
    { id: 11, name: "Chips", price: 10.0, image: "🍟" },
    { id: 12, name: "Crackers", price: 12.0, image: "🍘" },
    { id: 13, name: "Nuts", price: 15.0, image: "🥜" },
  ],
};

export const dateFilterOptions: Option[] = [
  { value: 1, label: "Today" },
  { value: 2, label: "Yesterday" },
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 60, label: "Last Month" },
  { value: "custom", label: "Custom" },
];

export const adminRoutes = [
  "/",
  "/pos-terminal",
  "/total-sales",
  "/settings",
  "/products",
  "/inventory",
  "/categories",
  "/shops",
  "/users",
];

export const managerRoutes = [
  "/pos-terminal",
  "/total-sales",
  "/settings",
  "/products",
  "/inventory",
  "/categories",
  "/",
];

export const cashierRoutes = ["/pos-terminal", "/total-sales", "/settings"];
