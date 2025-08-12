export interface ShopTypes {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  products_count: string;
}

export interface CategoryTypes {
  id: number;
  name: string;
  description: string;
  status: string;
  product_count: number;
}

export interface ProductTypes {
  id: number;
  active: string;
  name: string;
  barcode: string;
  category_id: number;
  category: CategoryTypes;
  shop: ShopTypes;
  product_type: string;
  stock: string;
  shop_id: string;
  unit_purchase_price: number;
  unit_selling_price: number;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface UserTypes {
  id: number;
  name: string;
  email: string;
  role: string;
  shops: Array<string>;
  status: string;
}

export interface InventoryTypes {
  product_id: string;
  name: string;
  reorder: number;
  status: string;
  stock: string;
  description: string;
}

export interface OnlineSale {
  amount: string;
  cashier_name: string;
  customer: string;
  date: string;
  item_discount: string;
  item_name: string;
  order_id: number | string;
  payment_status: string;
  payment_type: string;
  quantity: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type DateFilterOption = 1 | 2 | 7 | 30 | 60 | "custom";

export interface Option {
  value: DateFilterOption;
  label: string;
}

export interface SalesFilterProps {
  options: Option[];
  setOption: (value: DateFilterOption) => void;
  option: DateFilterOption;
  customDateRange: {
    from: Date | null;
    to: Date | null;
  };
  setCustomDateRange: (range: { from: Date | null; to: Date | null }) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  selectedCashier: string;
  setSelectedCashier: (cashier: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}
