import type { FC } from "react";
import type { Document } from "../../../interfaces/document/document";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Heart,
  CheckCircle,
  LoaderPinwheel,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SubItemDocumentProgressProps {
  document: Document;
  type?: "favorite" | "inProgress" | "complete";
}

export const SubItemDocumentProgress: FC<SubItemDocumentProgressProps> = ({
  document,
  type,
}) => {
  // 🎨 Couleur et icône selon le type de progression
  const getStatus = () => {
    switch (type) {
      case "favorite":
        return {
          color: "text-rose-600",
          bg: "bg-rose-50 border-rose-200",
          icon: <Heart className="text-rose-600" size={18} />,
          label: "Favori ❤️",
        };
      case "inProgress":
        return {
          color: "text-sky-700",
          bg: "bg-sky-50 border-sky-200",
          icon: (
            <LoaderPinwheel
              className="text-sky-700 animate-spin-slow"
              size={18}
            />
          ),
          label: "En progression ⏳",
        };
      case "complete":
        return {
          color: "text-green-700",
          bg: "bg-green-50 border-green-200",
          icon: <CheckCircle className="text-green-700" size={18} />,
          label: "Terminé ✅",
        };
      default:
        return {
          color: "text-gray-700",
          bg: "bg-gray-50 border-gray-200",
          icon: <BookOpen className="text-gray-600" size={18} />,
          label: "Cours",
        };
    }
  };

  const status = getStatus();

  return (
    <motion.div
      className={`w-full border-gray-300 border rounded-lg bg-white shadow px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
    >
      {/* === Partie gauche : infos cours === */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          {status.icon}
          <span className={`text-sm font-semibold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="text-gray-800 font-montserrat text-base">
          {document.name}
        </div>

        <div className="text-gray-500 text-sm italic">
          ({document.category.name})
        </div>
      </div>

      {/* === Partie droite : bouton d'accès === */}
      <Link
        to={`/category/${document.category.slug}/${document.slug}`}
        className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 transition"
      >
        <span>Ouvrir le cours</span>
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
};
