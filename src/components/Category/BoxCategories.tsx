import { motion } from "framer-motion";
import { useMenu } from "../../hooks/useMenu";
import { useNavigate } from "react-router-dom";

export const BoxCategories = () => {
  const { menu } = useMenu();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center justify-center px-3 py-6">
      {menu.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{
            y: -3,
            boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-4 w-full sm:w-3/4 lg:w-1/2 flex flex-row justify-between items-center border rounded-xl border-gray-200 shadow-sm hover:border-emerald-800/40"
        >
          <div className="flex flex-col">
            <span className="font-montserrat capitalize tracking-wide font-semibold text-emerald-800">
              {category.name}
            </span>
            <span className="font-montserrat text-sm text-blue-800/80 font-light mt-0.5">
              {category.count === 0
                ? "Aucun cours disponible"
                : category.count === 1
                ? "1 cours disponible"
                : `${category.count} cours disponibles`}
            </span>
          </div>

          <motion.button
            onClick={() => navigate(`/category/${category.slug}`)}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="bg-emerald-900 text-white px-3 py-2 rounded-lg font-semibold tracking-wider text-xs font-montserrat cursor-pointer transition-all duration-200 hover:bg-emerald-800 hover:underline underline-offset-2"
          >
            Explorer
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
};
