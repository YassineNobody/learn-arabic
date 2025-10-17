import { User2 } from "lucide-react";
import { useModal } from "../../../hooks/useModal";
import { UpdateUserModalForm } from "../Modal/UpdateUserModal";
import { useAuth } from "../../../hooks/useAuth";

export const InfosUserSimple = () => {
  const { user } = useAuth();
  const { hideModal, showModal } = useModal();
  const handleUpdateUser = () => {
    showModal({
      title: "Modification du profile",
      Component: UpdateUserModalForm,
      props: { onClose: hideModal, user: user },
    });
  };
  return (
    <div className=" py-3 flex flex-col items-center justify-center">
      {user && (
        <div
          className="flex flex-row gap-3 items-center justify-center hover:underline duration-1000 transition-all underline-offset-4 cursor-pointer"
          onClick={handleUpdateUser}
        >
          <User2 size={25} className="bg-blue-600 text-white rounded-full" />
          <span className="text-lg font-montserrat tracking-wider capitalize font-medium">
            {user.username}
          </span>
        </div>
      )}
    </div>
  );
};
