import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../services/api";
import ApiAlert from "../../ApiAlert/ApiAlert";
import Loader from "../../Spinner/Loader";
import { EyeOff, Eye, MailCheck } from "lucide-react";
import type { CreateUser as UserRegister } from "../../../interfaces/user/user";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // ✅ affichage du message de succès

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>();

  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: async (data: UserRegister) => await api.register(data),
    retry: false,
    onSuccess: () => {
      setIsRegistered(true); // ✅ afficher le message de vérification
    },
  });

  const onSubmit = async (data: UserRegister) => {
    await mutateAsync(data);
  };

  // ✅ Si l’utilisateur vient de s’inscrire, on affiche le message
  if (isRegistered) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8 font-poppins">
        <MailCheck size={48} className="text-green-700" />
        <h2 className="text-xl font-semibold text-gray-800">
          Vérifiez votre e-mail 📩
        </h2>
        <p className="text-sm text-gray-600 max-w-sm">
          Votre compte a été créé avec succès. Un lien de vérification vous a
          été envoyé à votre adresse e-mail. Cliquez dessus pour activer votre
          compte.
        </p>
        <p className="text-red-600 font-bold text-lg">Vérifiez vos spams</p>
      </div>
    );
  }

  // ✅ Sinon, on affiche le formulaire
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 font-montserrat"
    >
      {/* Nom d'utilisateur */}
      <div className="space-y-1">
        <label
          htmlFor="username"
          className="text-sm font-semibold block text-gray-800"
        >
          Nom d'utilisateur
        </label>
        <input
          type="text"
          id="username"
          placeholder="ex: yassine123"
          {...register("username", {
            required: "Veuillez entrer un nom d'utilisateur",
            minLength: {
              value: 3,
              message:
                "Le nom d'utilisateur doit comporter au moins 3 caractères",
            },
          })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="text-sm font-semibold block text-gray-800"
        >
          Adresse e-mail
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder="user@example.com"
          {...register("email", {
            required: "Veuillez entrer votre adresse e-mail",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Veuillez entrer une adresse e-mail valide",
            },
          })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-sm font-semibold block text-gray-800"
        >
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password", {
              required: "Veuillez entrer votre mot de passe",
              minLength: {
                value: 6,
                message: "Le mot de passe doit comporter au moins 6 caractères",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Bouton soumettre */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md text-sm font-bold cursor-pointer transition flex items-center gap-2"
        >
          {isPending && <Loader size={16} />}
          {isPending ? "Inscription..." : "Créer un compte"}
        </button>
      </div>

      {/* Erreur API */}
      {isError && (
        <ApiAlert
          title="Erreur lors de l'inscription"
          description={error?.message ?? "Une erreur est survenue"}
          variant="error"
        />
      )}
    </form>
  );
};
