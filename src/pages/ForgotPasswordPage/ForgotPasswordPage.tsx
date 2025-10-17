/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import type { ForgotPassword } from "../../interfaces/user/user";
import type { ErrorResponse } from "../../interfaces/common/common";

export const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassword>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPassword) => {
    setLoading(true);
    setError(null);

    try {
      await api.forgotPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-green-600 text-xl font-semibold mb-2">
          Email envoyé ✅
        </h2>
        <p className="text-gray-600 max-w-md">
          Consultez votre boîte mail pour réinitialiser votre mot de passe. Le
          lien est valable 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-semibold mb-3">Mot de passe oublié 🔑</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-72 text-left"
      >
        <label htmlFor="email" className="font-medium text-gray-700">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          {...register("email", {
            required: "L'adresse e-mail est obligatoire",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Adresse e-mail invalide",
            },
          })}
          className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer le lien"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mt-3">{error.description}</p>
      )}
    </div>
  );
};
