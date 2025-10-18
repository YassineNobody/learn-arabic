import { motion } from "framer-motion";
import type { Document as DocumentModel } from "../../interfaces/document/document";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

export const ItemLastDocument = ({ doc }: { doc: DocumentModel }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-sm bg-gray-200 rounded-2xl flex flex-col shadow-lg overflow-hidden"
    >
      <img
        src="https://res.cloudinary.com/dtolumjkr/image/upload/v1760689353/ChatGPT_Image_17_oct._2025_10_21_22_fmts2e.png"
        alt="document"
        className="w-full aspect-video object-cover"
      />

      <div className="flex flex-col justify-between flex-1 p-3">
        <div>
          <span className="block font-montserrat tracking-wider uppercase text-xs line-clamp-1">
            {doc.name}
          </span>
          <span className="block font-montserrat tracking-wide italic capitalize text-xs text-gray-600">
            {doc.category.name}
          </span>
        </div>

        <button
          onClick={() => navigate(`/category/${doc.category.slug}/${doc.slug}`)}
          className="mt-3 flex flex-row justify-center items-center gap-1 px-3 py-2 rounded-2xl bg-white border border-gray-400 font-montserrat font-medium text-xs uppercase tracking-widest hover:bg-gray-100 transition"
        >
          découvrir <Globe size={14} />
        </button>
      </div>
    </motion.div>
  );
};
