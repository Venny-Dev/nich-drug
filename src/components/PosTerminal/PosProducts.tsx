import { Search } from "lucide-react";
import { usePosTerminalContext } from "../../contexts/PosTerminalContext";
import { useEffect, useMemo, useState } from "react";
import PosProduct from "./PosProduct";
import { useCategories } from "../../customHooks/useCategories";
import type { CategoryTypes } from "../../utils/types";
import { useProducts } from "../../customHooks/useProducts";
import LoaderPage from "../../ui/LoaderPage";
import EmptyData from "../../ui/EmptyData";

function PosProducts() {
  const { addToCart } = usePosTerminalContext();

  const { categories, isGettingCategories } = useCategories();
  const { products, isGettingProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    if (!isGettingCategories) {
      setActiveCategory(categories[0]?.name || "");
    }
  }, [isGettingCategories, categories, isGettingProducts]);

  const filteredProducts = useMemo(() => {
    if (isGettingProducts) {
      return [];
    }

    if (activeCategory === "all") {
      return products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return products.filter(
      (product: any) =>
        product.category?.name.toLowerCase() === activeCategory.toLowerCase() &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [isGettingProducts, products, activeCategory, searchTerm]);

  // console.log(activeCategory);
  // console.log(filteredProducts);
  return (
    <div className="flex-1 lg:bg-white rounded-lg  lg:p-4 lg:max-w-[358px] xl:max-w-[520px] h-fit xl:h-[470px]  xl:overflow-y-auto">
      {/* Search */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto py-3">
        {isGettingCategories && (
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${"bg-white text-black hover:bg-gray-200 shadow-sm"}`}
          >
            Loading categories...
          </button>
        )}
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
            activeCategory === "all"
              ? "bg-[#37589F99] text-white"
              : "bg-white text-black hover:bg-gray-200 shadow-sm"
          }`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {!isGettingCategories &&
          categories.map((category: CategoryTypes) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeCategory === category.name
                  ? "bg-[#37589F99] text-white"
                  : "bg-white text-black hover:bg-gray-200 shadow-sm"
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>

      {/* Products Grid */}
      {isGettingProducts && <LoaderPage />}
      {!isGettingProducts && filteredProducts.length === 0 && (
        <EmptyData text=" No products found in this category." />
      )}
      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-1  gap-4 overflow-y-auto">
        {!isGettingProducts &&
          filteredProducts.length > 0 &&
          filteredProducts.map((product: any) => (
            <PosProduct
              key={product.id}
              addToCart={addToCart}
              product={product}
            />
          ))}
      </div>
    </div>
  );
}

export default PosProducts;
