import type { FC } from "react";
import type { Progression } from "../../../interfaces/progression/progression";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { ItemProgressDocument } from "./ItemProgressDocument";

export const UserProgressDashboard: FC<{ progression: Progression }> = ({
  progression,
}) => {
  const progressFr = {
    "Mes cours favoris": progression.favorites,
    "Mes cours en progression": progression.inProgress,
    "Mes cours terminés": progression.complete,
  };
  // 🌀 Animation d’apparition globale
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      className="flex-1 w-full max-w-6xl mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* === Titre principal === */}
      <motion.div
        className="flex items-center justify-center gap-2 text-center pb-6"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <LayoutDashboard
            size={28}
            className="text-green-700 drop-shadow-sm"
          />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat tracking-wide text-gray-800">
          Mon tableau de bord
        </h1>
      </motion.div>

      {/* === Liste des sections (favoris, progression, terminés) === */}
      <motion.div
        className="flex flex-col gap-8"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {(Object.keys(progressFr) as Array<keyof typeof progressFr>).map(
          (entry, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ItemProgressDocument
                label={entry}
                documents={progressFr[entry]}
              />
            </motion.div>
          )
        )}
      </motion.div>
    </motion.div>
  );
};
