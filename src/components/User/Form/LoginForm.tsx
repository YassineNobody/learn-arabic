import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../../../services/api";
import Loader from "../../Spinner/Loader";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ApiAlert from "../../ApiAlert/ApiAlert";
import type { ErrorResponse } from "../../../interfaces/common/common";

type LoginFormProps = {
  username?: string;
  email?: string;
  password: string;
};

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [useEmail, setUseEmail] = useState(true);
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginFormProps>();

  const { mutateAsync, isError, isPending, error } = useMutation({
    mutationFn: async (data: LoginFormProps) => await api.login(data),
    retry: false,
    onSuccess: ({ data }) => {
      const { user, token } = data;
      authenticate(user, token);
      navigate("/dashboard");
    },
  });

  // 🧠 Nettoyer le champ inactif quand on change le mode
  const handleToggle = () => {
    setUseEmail((prev) => !prev);
    if (useEmail) {
      resetField("email");
    } else {
      resetField("username");
    }
  };

  const onSubmit = async (formData: LoginFormProps) => {
    // 🧩 N'envoie que le champ actif
    const dataToSend = {
      password: formData.password,
      ...(useEmail
        ? { email: formData.email }
        : { username: formData.username }),
    };

    console.log("👉 Data envoyée :", dataToSend);
    await mutateAsync(dataToSend);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 font-montserrat"
    >
      {/* ✅ Toggle Email / Username */}
      <div className="flex items-center justify-center gap-2">
        <label className="text-sm text-gray-700 font-light">
          Connexion avec :
        </label>
        <button
          type="button"
          onClick={handleToggle}
          className="relative inline-flex items-center h-5 w-10 rounded-full border border-gray-300 transition-colors duration-300 bg-gray-200 hover:bg-gray-300"
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
              useEmail ? "translate-x-0" : "translate-x-5"
            }`}
          ></span>
        </button>
        <span className="text-sm text-gray-700 font-medium">
          {useEmail ? "E-mail" : "Nom d’utilisateur"}
        </span>
      </div>

      {/* ✅ Champ conditionnel */}
      {useEmail ? (
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-800 block text-center"
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
                message: "Adresse e-mail invalide",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-sm font-semibold text-gray-800 block text-center"
          >
            Nom d’utilisateur
          </label>
          <input
            type="text"
            id="username"
            autoComplete="username"
            placeholder="ex: yassine123"
            {...register("username", {
              required: "Veuillez entrer votre nom d’utilisateur",
              minLength: {
                value: 3,
                message:
                  "Le nom d’utilisateur doit comporter au moins 3 caractères",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>
      )}

      {/* ✅ Mot de passe */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-gray-800 block text-center"
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
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* ✅ Bouton */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md text-xs tracking-widest font-bold uppercase cursor-pointer transition flex items-center gap-2"
        >
          {isPending && <Loader size={16} />}
          {isPending ? "Connexion..." : "Se connecter"}
        </button>
      </div>

      {/* ✅ Erreur API */}
      {isError && (
        <ApiAlert
          title="Erreur de connexion"
          description={
            (error as unknown as ErrorResponse).description ??
            "Une erreur est survenue"
          }
          variant="error"
        />
      )}
    </form>
  );
};
