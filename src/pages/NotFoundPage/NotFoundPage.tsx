import type { FC } from "react";
import { Link } from "react-router-dom";

const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <p className="mt-4 text-xl text-gray-600 ">
        Oups... La page que tu cherches n'existe pas.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
