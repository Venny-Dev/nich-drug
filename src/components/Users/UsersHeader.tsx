import { useShopContext } from "../../contexts/ShopContext";
import { useExportUsers } from "../../customHooks/useExports";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddUser from "./AddUser";

function UsersHeader() {
  const { isModalOpen, setIsModalOpen } = useShopContext();
  const { exportUsers, isExportingUsers } = useExportUsers();
  return (
    <>
      <div className="flex justify-between  items-center">
        <h1 className="font-bold text-[16px]">Users and Roles</h1>
        <div className="space-x-[11px]">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger
              className="bg-[#37589F99] p-3 text-white rounded-[8px] cursor-pointer"
              role="button"
            >
              + Add
            </DialogTrigger>
            <DialogContent className="bg-white border-none max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Add User or Role</DialogTitle>
              </DialogHeader>

              <AddUser setIsModalOpen={setIsModalOpen} />
            </DialogContent>
          </Dialog>

          <button
            className="bg-[#37589F99] p-3 text-white rounded-[8px]"
            onClick={() => exportUsers()}
            disabled={isExportingUsers}
          >
            {isExportingUsers ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
    </>
  );
}

export default UsersHeader;
