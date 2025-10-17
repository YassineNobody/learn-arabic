import type { FC } from "react";
import type { Document } from "../../../interfaces/document/document";
import { motion } from "framer-motion";
import { BookmarkCheck, Heart, LoaderPinwheel } from "lucide-react";
import { SubItemDocumentProgress } from "./SubItemDocumentProgress";

interface ItemProgressDocumentProps {
  label: string;
  documents: Document[];
}

export const ItemProgressDocument: FC<ItemProgressDocumentProps> = ({
  label,
  documents,
}) => {
  const getIconAndType = () => {
    if (label === "Mes cours en progression") {
      return {
        icon: <LoaderPinwheel size={20} className="text-sky-700" />,
        type: "inProgress" as const,
        color: "text-sky-700",
      };
    } else if (label === "Mes cours favoris") {
      return {
        icon: <Heart size={20} className="text-rose-600" />,
        type: "favorite" as const,
        color: "text-rose-600",
      };
    } else {
      return {
        icon: <BookmarkCheck size={20} className="text-green-700" />,
        type: "complete" as const,
        color: "text-green-700",
      };
    }
  };

  const { icon, type, color } = getIconAndType();

  // 🎨 Animation d’apparition
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (documents.length === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        id={`#${label}`}
        className="shadow flex flex-col gap-2 items-center py-4 px-4 mx-4 rounded-xl border border-gray-200 bg-white"
      >
        <div
          className={`flex items-center gap-2 text-lg font-semibold font-montserrat ${color}`}
        >
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-sm italic font-light py-2 px-4 text-gray-500 text-center">
          Aucun cours{" "}
          {label === "Mes cours en progression"
            ? "en cours de lecture."
            : label === "Mes cours favoris"
            ? "ajouté aux favoris."
            : "terminé pour le moment."}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id={`#${label}`}
      className="shadow flex flex-col gap-3 py-4 px-4 mx-4 rounded-xl border border-gray-200 bg-white"
    >
      {/* === Titre du groupe === */}
      <div
        className={`flex items-center gap-2 text-lg font-semibold font-montserrat ${color}`}
      >
        {icon}
        <span>{label}</span>
      </div>

      {/* === Liste des documents === */}
      <motion.div
        className="flex flex-col gap-3 w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {documents.map((doc, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <SubItemDocumentProgress document={doc} type={type} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
