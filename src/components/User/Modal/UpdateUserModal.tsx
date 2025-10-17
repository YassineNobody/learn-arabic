import type { FC } from "react";
import type { User } from "../../../interfaces/user/user";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../../../services/api";
import SpinnerLoader from "../../Spinner/Loader";
import { useAuth } from "../../../hooks/useAuth";

interface UpdateUserModalProps {
  onClose: () => void;
  user: User;
}

export const UpdateUserModalForm: FC<UpdateUserModalProps> = ({
  onClose,
  user,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string }>({
    defaultValues: { username: user.username },
  });
  const { setUser } = useAuth();
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async ({ username }: { username: string }) =>
      await api.updateCurrentUser(username),
    retry: false,
    onSuccess: ({ data }) => {
      setUser(data);
      onClose();
    },
  });

  const onSubmit = async ({ username }: { username: string }) => {
    await mutateAsync({ username });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-5 font-poppins"
    >
      <div className="space-y-1">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700 block"
        >
          Nom d'utilisateur
        </label>
        <input
          type="text"
          id="username"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          {...register("username", {
            required: "Le nom d'utilisateur est requis",
            minLength: { value: 4, message: "Nom d'utilisateur trop court" },
          })}
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>
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
