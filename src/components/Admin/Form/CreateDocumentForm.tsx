import { useState } from "react";
import { useMenu } from "../../../hooks/useMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { CreateDocument } from "../../../interfaces/document/document";
import { createDocument } from "../../../services/document";
import DropZone from "../../DropZone/DropZone";
import SpinnerLoader from "../../Spinner/Loader";

export const CreateDocumentForm = () => {
  const { menu } = useMenu(); // Catégories
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateDocument>();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (data: FormData) => await createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      reset();
      setFile(null);
      navigate("/dashboard");
    },
  });

  const onSubmit = async (data: CreateDocument) => {
    if (!file) {
      setError("file", {
        type: "manual",
        message: "Veuillez sélectionner un fichier PDF",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId.toString());
    formData.append("file", file);

    await mutateAsync(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-5 font-poppins"
    >
      <h2 className="text-xl font-semibold text-center text-green-700">
        Ajouter un document PDF
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
          placeholder="Ex: Leçon sur le verbe كَتَبَ"
          {...register("name", {
            required: "Le nom du document est requis",
            minLength: { value: 2, message: "Nom trop court" },
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
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
          placeholder="Une courte description du contenu..."
          {...register("description", {
            required: "La description est requise",
            minLength: { value: 10, message: "Description trop courte" },
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
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
          Sélectionner une catégorie
        </label>
        <select
          id="categoryId"
          {...register("categoryId", {
            required: "Veuillez sélectionner une catégorie",
            valueAsNumber: true,
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">-- Aucune catégorie --</option>
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
          Fichier PDF
        </label>
        <DropZone
          file={file}
          onFileAccepted={setFile}
          onFileRemoved={() => setFile(null)}
        />
        {errors.file && (
          <p className="text-red-600 text-sm">{errors.file.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-2.5 transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <SpinnerLoader size={16} />
            <span>Envoi en cours...</span>
          </>
        ) : (
          "Créer le document"
        )}
      </button>

      {/* Erreur backend */}
      {isError && (
        <p className="text-red-600 text-center text-sm font-medium mt-2">
          {(error as Error)?.message ||
            "Une erreur est survenue lors de l'envoi."}
        </p>
      )}
    </form>
  );
};
