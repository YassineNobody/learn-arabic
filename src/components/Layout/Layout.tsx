import { Suspense, type FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { LoadingMessage } from "../Loader/LoadingMessage";
import { Navbar } from "../Navbar/Navbar";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

export const Layout: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <LoadingMessage />
        </div>
      }
    >
      <ErrorBoundary>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Barre en haut */}
          <header className="flex flex-row items-center justify-between shadow border-b border-gray-300 py-1 px-2">
            <Link to={"/"} className="font-poppins tracking-widest text-lg">
              LearnArabic
            </Link>
            <Navbar />
          </header>

          {/* Contenu principal */}
          <main className="flex-1 text-black flex flex-col">
            <Outlet />
          </main>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
