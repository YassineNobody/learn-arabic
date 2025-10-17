import type { FC } from "react";
import type { Document } from "../../../interfaces/document/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "../../../services/document";
import { useModal } from "../../../hooks/useModal";
import SpinnerLoader from "../../Spinner/Loader";

interface DeleteDocumentModalProps {
  doc: Document;
}

export const DeleteDocumentModal: FC<DeleteDocumentModalProps> = ({ doc }) => {
  const { hideModal } = useModal();
  const queryClient = useQueryClient();

  // 🧩 Mutation de suppression
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async () => await deleteDocument(doc.slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] }); // ✅ Refresh liste
      queryClient.invalidateQueries({ queryKey: ["admin-list-documents"] });
      hideModal(); // ✅ Ferme la modale
    },
  });

  // ⚙️ Action suppression
  const handleDelete = async () => {
    await mutateAsync();
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Supprimer le document ?
      </h3>

      <p className="text-gray-600 text-sm sm:text-base">
        Vous êtes sur le point de supprimer définitivement :{" "}
        <span className="font-medium text-red-600">"{doc.name}"</span>.
      </p>

      {isError && (
        <p className="text-red-600 text-sm">
          {(error as Error)?.message || "Une erreur est survenue."}
        </p>
      )}

      <div className="flex gap-3 pt-3">
        <button
          onClick={hideModal}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Annuler
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
        >
          {isPending && <SpinnerLoader size={16} />}
          Supprimer
        </button>
      </div>
    </div>
  );
};
