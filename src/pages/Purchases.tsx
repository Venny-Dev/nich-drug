import PurchasesContainer from "../components/Purchases/PurchasesContainer";
import PurchasesHeader from "../components/Purchases/PurchasesHeader";

function Purchases() {
  return (
    <div className="p-6">
      <PurchasesHeader />
      <PurchasesContainer />
    </div>
  );
}

export default Purchases;
