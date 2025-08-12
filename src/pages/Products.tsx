import ProductContainer from "../components/Products/ProductContainer";
import ProductsHeader from "../components/Products/ProductsHeader";

function Products() {
  return (
    <div className="p-6">
      <ProductsHeader />
      <ProductContainer />
    </div>
  );
}

export default Products;
