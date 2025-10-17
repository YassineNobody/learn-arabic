import { useState } from "react";
import type { FC } from "react";
import { useMenu } from "../../../hooks/useMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type {
  Document,
  UpdateDocument,
} from "../../../interfaces/document/document";
import { updateDocument } from "../../../services/document";
import DropZone from "../../DropZone/DropZone";
import SpinnerLoader from "../../Spinner/Loader";

interface UpdateDocumentProps {
  onClose: () => void;
  document: Document;
}

export const UpdateDocumentForm: FC<UpdateDocumentProps> = ({
  onClose,
  document,
}) => {
  const { menu } = useMenu();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  // ✅ Initialisation du formulaire avec les valeurs du document
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDocument>({
    defaultValues: {
      name: document.name,
      description: document.description,
      categoryId: document.category.id,
    },
  });

  // ✅ Mutation de mise à jour
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (formData: FormData) =>
      await updateDocument(document.slug, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-list-documents"] });

      onClose();
    },
  });

  // ✅ Soumission du formulaire
  const onSubmit = async (data: UpdateDocument) => {
    const formData = new FormData();
    formData.append("name", data.name ?? document.name);
    formData.append("description", data.description ?? document.description);
    formData.append(
      "categoryId",
      String(data.categoryId ?? document.category.id)
    );

    // Si un nouveau fichier a été ajouté
    if (file) {
      formData.append("file", file);
    }

    await mutateAsync(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-5 font-poppins"
    >
      <h2 className="text-xl font-semibold text-center text-blue-700">
        Modifier le document
      </h2>

      {/* Nom */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 block"
        >
          Nom du document
        </label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Le nom est requis",
            minLength: { value: 2, message: "Nom trop court" },
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 block"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description", {
            required: "La description est requise",
            minLength: { value: 10, message: "Description trop courte" },
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        />
        {errors.description && (
          <p className="text-red-600 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-1">
        <label
          htmlFor="categoryId"
          className="text-sm font-medium text-gray-700 block"
        >
          Catégorie
        </label>
        <select
          id="categoryId"
          {...register("categoryId", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {menu.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-600 text-sm">{errors.categoryId.message}</p>
        )}
      </div>

      {/* DropZone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 block">
          Remplacer le fichier PDF (optionnel)
        </label>
        <DropZone
          file={file}
          onFileAccepted={setFile}
          onFileRemoved={() => setFile(null)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <SpinnerLoader size={16} />
              <span>Enregistrement...</span>
            </>
          ) : (
            "Mettre à jour"
          )}
        </button>
      </div>

      {/* Erreur backend */}
      {isError && (
        <p className="text-red-600 text-center text-sm font-medium mt-2">
          {(error as Error)?.message ||
            "Une erreur est survenue lors de la mise à jour."}
        </p>
      )}
    </form>
  );
};
