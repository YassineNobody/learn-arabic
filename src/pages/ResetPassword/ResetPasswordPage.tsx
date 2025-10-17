/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";
import { api } from "../../services/api";
import { LoadingMessage } from "../../components/Loader/LoadingMessage";
import type { ResetPassword } from "../../interfaces/user/user";
import type { ErrorResponse } from "../../interfaces/common/common";

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");
  const [missingToken, setMissingToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    defaultValues: { token: token ?? "", newPassword: "" },
  });

  // Vérifie la présence du token dans l'URL
  useEffect(() => {
    if (!token) setMissingToken(true);
  }, [token]);

  const onSubmit = async (data: ResetPassword) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await api.resetPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await api.resendVerification(email, "PASSWORD_RESET");
      setResent(true);
    } catch (err: any) {
      setError(err);
    }
  };

  // 🚨 Aucun token dans l'URL
  if (missingToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-red-600 text-xl font-semibold mb-2">
          Lien invalide ❌
        </h2>
        <p className="text-gray-600 mb-4">
          Le lien de réinitialisation est manquant ou invalide.
        </p>
        <button
          onClick={() => navigate("/forgot-password")}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
        >
          Demander un nouveau lien
        </button>
      </div>
    );
  }

  // ✅ Succès
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-green-600 text-xl font-semibold mb-2">
          Mot de passe mis à jour ✅
        </h2>
        <p className="text-gray-600 mb-4">
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
        >
          Aller à la connexion
        </button>
      </div>
    );
  }

  // ✉️ Mail renvoyé
  if (resent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-green-600 text-xl font-semibold mb-2">
          Nouveau mail envoyé ✅
        </h2>
        <p className="text-gray-600">
          Consultez votre boîte mail pour réinitialiser votre mot de passe.
        </p>
      </div>
    );
  }

  // ⚠️ Erreur (ex: token expiré ou déjà utilisé)
  if (error) {
    const isExpired = error.errorCode === "TOKEN_EXPIRED";
    const isAlreadyUsed = error.errorCode === "TOKEN_ALREADY_USED";

    if (isAlreadyUsed) {
      navigate("/login");
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
        <h2 className="text-red-600 text-xl font-semibold">
          Lien invalide ou expiré
        </h2>
        <p className="text-gray-700">{error.description}</p>

        {isExpired ? (
          <>
            <input
              type="email"
              placeholder="Entrez votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={handleResend}
              disabled={!email}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              Renvoyer un mail de réinitialisation
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Retour à la connexion
          </button>
        )}
      </div>
    );
  }

  // ⏳ Chargement
  if (loading) {
    return <LoadingMessage label="Mise à jour du mot de passe..." />;
  }

  // 🧩 Formulaire principal
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center gap-6">
        <h1 className="text-xl sm:text-2xl font-semibold font-montserrat text-gray-800 text-center">
          Réinitialiser votre mot de passe
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 w-full font-montserrat"
        >
          {/* Nouveau mot de passe */}
          <div className="space-y-1">
            <label
              htmlFor="newPassword"
              className="text-sm font-semibold text-gray-800 block text-center"
            >
              Nouveau mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                placeholder="••••••••"
                {...register("newPassword", {
                  required: "Veuillez entrer un mot de passe",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/,
                    message:
                      "Doit contenir une majuscule, une minuscule, un chiffre et un symbole",
                  },
                })}
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-green-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md text-xs tracking-widest font-bold uppercase cursor-pointer transition"
            >
              {loading ? "Réinitialisation..." : "Changer le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
