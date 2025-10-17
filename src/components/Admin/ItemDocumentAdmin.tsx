import type { FC } from "react";
import type { Document } from "../../interfaces/document/document";
import { Pencil, Trash } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { UpdateDocumentForm } from "./Modal/UpdateDocument";
import { DeleteDocumentModal } from "./Modal/DeleteDocument";

interface ItemDocumentAdminProps {
  doc: Document;
}

export const ItemDocumentAdmin: FC<ItemDocumentAdminProps> = ({ doc }) => {
  const { hideModal, showModal } = useModal();
  const handleEdit = () => {
    showModal({
      title: "Modifier le document",
      Component: UpdateDocumentForm,
      props: { document: doc, onClose: hideModal },
    });
  };

  const handleDelete = () => {
    showModal({
      title: "Confirmation de suppression",
      Component: DeleteDocumentModal,
      props: { doc },
    });
  };
  return (
    <div
      key={doc.slug}
      className="bg-white border border-gray-200 hover:shadow-md transition rounded-xl 
                 flex flex-col sm:flex-row items-start sm:items-center justify-between 
                 gap-3 sm:gap-6 p-4"
    >
      {/* --- Informations --- */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm sm:text-base">
        <div>
          <span className="font-semibold text-gray-700">Nom :</span>{" "}
          <span className="text-gray-900">{doc.name}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Catégorie :</span>{" "}
          <span className="text-gray-900">{doc.category.name}</span>
        </div>
        <div className="text-gray-500 text-xs sm:text-sm">
          Créé le : {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
        </div>
      </div>

      {/* --- Actions --- */}
      <div className="flex flex-row items-center gap-3 sm:gap-4 self-end sm:self-auto">
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-100 rounded-full transition"
          title="Supprimer"
        >
          <Trash size={18} className="text-red-600" />
        </button>
        <button
          onClick={handleEdit}
          className="p-2 hover:bg-green-100 rounded-full transition"
          title="Modifier"
        >
          <Pencil size={18} className="text-green-600" />
        </button>
      </div>
    </div>
  );
};
