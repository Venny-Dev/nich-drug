import InventoryContainer from "../components/Inventory/InventoryContainer";
import InventoryHeader from "../components/Inventory/InventoryHeader";

function Inventory() {
  return (
    <div className="p-6">
      <InventoryHeader />
      <InventoryContainer />
    </div>
  );
}

export default Inventory;
