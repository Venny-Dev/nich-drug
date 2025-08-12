import CategoryContainer from "../components/Category.tsx/CategoryContainer";
import CategoryHeader from "../components/Category.tsx/CategoryHeader";

function Category() {
  return (
    <div className="p-6">
      <CategoryHeader />
      <CategoryContainer />
    </div>
  );
}

export default Category;
