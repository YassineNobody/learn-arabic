/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { api } from "../../services/api";
import { LoadingMessage } from "../../components/Loader/LoadingMessage";
import type { ErrorResponse } from "../../interfaces/common/common";

const VerifyMailPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const { authenticate, refetchUser } = useAuth();
  const { persistValue: setToken } = useLocalStorageState("auth");

  const [email, setEmail] = useState("");
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [resent, setResent] = useState(false);

  // ⚙️ Vérification directe du token
  if (loading && token) {
    api
      .verifyMail(token)
      .then(async (resp) => {
        const newToken = resp.data.token;
        setToken(newToken);

        // ⚠️ Utiliser le nouveau token, pas l'ancien
        const authReload = await refetchUser(newToken);

        if (authReload) {
          authenticate(authReload.user, newToken);
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      })

      .catch((err: any) => {
        const backendError: ErrorResponse = err;
        // ✅ Si le token a déjà été utilisé, on redirige directement
        if (backendError?.errorCode === "TOKEN_ALREADY_USED") {
          navigate("/dashboard");
          return;
        }
        // Sinon, on affiche une erreur
        setError(backendError);
        setLoading(false);
      });
  }

  // 🔁 Renvoyer un nouveau lien si le token est expiré
  const handleResend = async () => {
    if (!email) return;
    try {
      await api.resendVerification(email, "EMAIL_VERIFICATION");
      setResent(true);
    } catch (err: any) {
      setError(err.response?.data);
    }
  };

  // 🕓 Chargement
  if (loading) {
    return <LoadingMessage label="Vérification de votre compte en cours..." />;
  }

  // ✅ Mail renvoyé avec succès
  if (resent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-green-600 text-xl font-semibold mb-2">
          Nouveau mail envoyé ✅
        </h2>
        <p className="text-gray-600">
          Consultez votre boîte mail pour confirmer à nouveau votre compte.
        </p>
      </div>
    );
  }
  // ❌ Erreur détectée
  if (error) {
    const isTokenExpired = error.errorCode === "TOKEN_EXPIRED";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
        <h2 className="text-red-600 text-xl font-semibold">
          Échec de la vérification
        </h2>
        <p className="text-gray-700">{error.description}</p>

        {isTokenExpired ? (
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
              Renvoyer un mail de vérification
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

  return null;
};

export default VerifyMailPage;
