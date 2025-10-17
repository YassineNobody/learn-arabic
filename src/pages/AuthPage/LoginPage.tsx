import { Link } from "react-router-dom";
import { LoginForm } from "../../components/User/Form/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center gap-6">
        <h1 className="text-xl sm:text-2xl font-semibold font-montserrat text-gray-800 text-center">
          Connectez-vous à votre compte
        </h1>

        <div className="w-full">
          <LoginForm />
        </div>

        {/* 🔑 Lien mot de passe oublié */}
        <div className="w-full text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Vous n’avez pas de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
};
