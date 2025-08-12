import { useState } from "react";
import { useDeleteUser } from "../../customHooks/useUser";
import DeleteModal from "../../ui/DeleteModal";
import { capitalizeFirst } from "../../utils/helpers";
import type { UserTypes } from "../../utils/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddUser from "./AddUser";

interface UserProps {
  user: UserTypes;
}

function User({ user }: UserProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { isDeletingUser, deleteUser } = useDeleteUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-flow-col auto-cols-max gap-3 py-4 border-t border-[#88918B4D] items-center pl-5">
      <div className="min-w-[193px] text-[16px] font-normal flex items-center gap-3">
        <img src="/avatar.png" alt="profile" className="size-[25px]" />
        {user.name}
      </div>

      <div className="ml-5 min-w-[220px] text-[16px] max-w-[220px]">
        {capitalizeFirst(user.email)}
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[100px] ">
        {capitalizeFirst(user.role)}
      </div>
      <div className="font-normal text-[16px]  ml-3 min-w-[147px] max-w-[147px]">
        {user.shops.join(", ")}
      </div>
      <div className="font-medium text-[12px] text-secondary-custom min-w-[108px]">
        {user.status.toLowerCase() === "active" ? (
          <p className="bg-[#08AA0833] text-[#08AA08] w-fit px-2 py-1   rounded-full">
            Active
          </p>
        ) : (
          <p className="bg-[#88918B4D] text-[#88918B] w-fit px-2 py-1   rounded-full">
            Inactive
          </p>
        )}
      </div>
      <div className=" text-primary-custom  text-[12px] h-fit min-w-[90px]">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            className="bg-[#E5E5E54D] px-2 mr-1  rounded-[16px] cursor-pointer"
            role="button"
          >
            Edit
          </DialogTrigger>

          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <AddUser user={user} setIsModalOpen={setIsModalOpen} />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogTrigger
            className="bg-[#DA1515] text-white px-2  rounded-[16px] cursor-pointer"
            role="button"
          >
            Delete
          </DialogTrigger>
          <DialogContent className="bg-white border-none max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Delete</DialogTitle>
            </DialogHeader>
            <DeleteModal
              setIsOpen={setIsDeleteOpen}
              onDelete={deleteUser}
              isDeleting={isDeletingUser}
              name={user.name}
              id={`${user.id}`}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-[12px] font-medium text-others-normal-green  w-fit h-fit min-w-[80px]"></div>
    </div>
  );
}

export default User;
