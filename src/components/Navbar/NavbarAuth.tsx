import { AnimatePresence, motion } from "framer-motion";
import { LogOut, LogIn, UserPlus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// ✅ Navbar quand l'utilisateur est connecté
export const NavbarConnected =  ({onClick}:{onClick: () => void}) => {
  const { logout } = useAuth();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4 w-full px-2"
      >
        {/* Lien vers le dashboard */}
        <Link
          to="/dashboard"
          onClick={onClick}
          className="px-2 rounded-lg shadow bg-slate-50 border border-gray-300 w-full flex flex-row items-center justify-between py-1.5 text-green-700 font-poppins font-light"
        >
          <span>Mon compte</span>
          <User size={20} />
        </Link>

        {/* Bouton de déconnexion */}
        <motion.button
          onClick={() => {
            logout();
            onClick();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-2 rounded-lg shadow bg-slate-50 border border-gray-300 w-full flex flex-row items-center justify-between py-1.5 text-red-600 font-poppins font-light hover:bg-red-50 transition-all duration-200"
        >
          <span>Se déconnecter</span>
          <LogOut size={20} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

// ✅ Navbar quand l'utilisateur n'est PAS connecté
export const NavbarNoConnected = ({onClick}:{onClick: () => void}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4 w-full px-2"
      >
        {/* Lien vers la page de connexion */}
        <Link
          to="/login"
          onClick={onClick}
          className="px-2 rounded-lg shadow bg-slate-50 border border-gray-300 w-full flex flex-row items-center justify-between py-1.5 text-green-700 font-poppins font-light"
        >
          <span>Connexion</span>
          <LogIn size={20} />
        </Link>

        {/* Lien vers la page d'inscription */}
        <Link
          to="/register"
          onClick={onClick}
          className="px-2 rounded-lg shadow bg-slate-50 border border-gray-300 w-full flex flex-row items-center justify-between py-1.5 text-green-700 font-poppins font-light"
        >
          <span>Inscription</span>
          <UserPlus size={20} />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
