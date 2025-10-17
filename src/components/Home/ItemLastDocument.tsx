import { motion } from "framer-motion";
import type { Document as DocumentModel } from "../../interfaces/document/document";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

export const ItemLastDocument = ({ doc }: { doc: DocumentModel }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.001 }}
      transition={{ duration: 0.25 }}
      className="h-96 w-96 bg-gray-200 rounded-2xl flex flex-col items-center shadow-lg"
    >
      <div className="flex flex-col items-center overflow-hidden">
        <img
          src="https://res.cloudinary.com/dtolumjkr/image/upload/v1760689353/ChatGPT_Image_17_oct._2025_10_21_22_fmts2e.png"
          alt="img"
          className="rounded-2xl"
        />
      </div>
      <div className="w-full flex flex-row justify-between items-center py-2 rounded-bl-2xl rounded-br-2xl  px-3">
        <div className="flex flex-col gap-1 px-2 py-1">
          <span className="font-montserrat tracking-wider uppercase text-xs line-clamp-1">
            {doc.name}
          </span>
          <span className="font-montserrat tracking-wide italic capitalize text-xs">
            {doc.category.name}
          </span>
        </div>
        <div className="">
          <button
            onClick={() =>
              navigate(`/category/${doc.category.slug}/${doc.slug}`)
            }
            className="flex flex-row items-center gap-1  px-3 py-2 rounded-2xl bg-white border cursor-pointer border-gray-400 font-montserrat font-medium"
          >
            <span className="text-xs tracking-widest uppercase">découvrir</span>
            <Globe size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
