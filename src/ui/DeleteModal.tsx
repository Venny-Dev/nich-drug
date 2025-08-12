import Loader from "./Loader";

type DeleteModalProps = {
  setIsOpen: (isOpen: boolean) => void;
  onDelete: (id: string, options?: any) => void;
  isDeleting: boolean;
  name: string;
  id: string;
};

function DeleteModal({
  setIsOpen,
  onDelete,
  isDeleting,
  name,
  id,
}: DeleteModalProps) {
  return (
    <div>
      <h1>Are you sure you want to delete {name}? </h1>
      <div className="flex gap-2 mt-5 items-center justify-center">
        <button
          className={`bg-[#DA1515] text-white px-2  rounded-[16px] cursor-pointer py-2 flex-1 flex items-center justify-center ${
            isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() =>
            onDelete(id, {
              onSuccess: () => {
                setIsOpen(false);
              },
            })
          }
          disabled={isDeleting}
        >
          {isDeleting ? <Loader /> : "Continue"}
        </button>
        <button
          className={`flex-1 bg-[#14213D] text-white px-2  rounded-[16px]  py-2 
          `}
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
