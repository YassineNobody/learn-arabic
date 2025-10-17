import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useMenu } from "../../hooks/useMenu";
import { BoxDocumentBySlug } from "../../components/Document/BoxDocumentBySlug";

export const CategorySlugPage = () => {
  const { slug } = useParams();
  const { menu } = useMenu();

  if (!slug) {
    return (
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg italic font-bold">
          Aucune catégorie trouvée.
        </p>
      </div>
    );
  }

  const category = menu.find((p) => p.slug === slug);

  if (!category) {
    return (
      <div className="flex-1 p-6 flex flex-col justify-center items-center">
        <p className="text-red-500 text-lg italic font-bold">
          Aucune catégorie trouvée.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 px-4 py-4 flex flex-col gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-green-50 py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl shadow-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl sm:text-3xl capitalize text-blue-700 font-bold font-montserrat tracking-wide">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base tracking-wide font-light text-gray-700 italic font-montserrat">
          {category.description}
        </p>
      </motion.div>

      {/* Documents */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BoxDocumentBySlug category={category} />
      </motion.div>
    </motion.div>
  );
};
