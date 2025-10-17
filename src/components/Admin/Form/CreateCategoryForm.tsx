import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMenu } from "../../../hooks/useMenu";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { CreateCategory } from "../../../interfaces/category/category";
import { createCategory } from "../../../services/category";
import SpinnerLoader from "../../Spinner/Loader";
import { motion } from "framer-motion";

export const CreateCategoryForm = () => {
  const { menu } = useMenu(); // contient les catégories existantes
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateCategory>();

  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: async (data: CreateCategory) => await createCategory(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      navigate("/dashboard");
    },
  });

  const onSubmit = async (data: CreateCategory) => {
    const exists = menu.some(
      (p) => p.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (exists) {
      setError("name", {
        type: "manual",
        message: "Cette catégorie existe déjà",
      });
      return;
    }
    await mutateAsync(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-5 font-poppins"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-center text-green-700">
        Créer une catégorie
      </h2>

      {/* Nom */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 block"
        >
          Nom de la catégorie
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Grammaire, Lecture..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          {...register("name", {
            required: "Le nom de la catégorie est requis",
            minLength: { value: 2, message: "Nom trop court" },
          })}
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
          placeholder="Décrivez brièvement cette catégorie..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
          {...register("description", {
            required: "La description est requise",
            minLength: { value: 10, message: "Description trop courte" },
          })}
        />
        {errors.description && (
          <p className="text-red-600 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Bouton de validation */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-2.5 transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <SpinnerLoader size={16} />
            <span>Création en cours...</span>
          </>
        ) : (
          "Créer la catégorie"
        )}
      </button>

      {/* Erreur API globale */}
      {isError && !errors.name && (
        <p className="text-red-600 text-center text-sm font-medium mt-2">
          {(error as Error)?.message || "Une erreur est survenue."}
        </p>
      )}
    </motion.form>
  );
};
