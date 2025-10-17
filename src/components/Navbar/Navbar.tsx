import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Compass, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMenu } from "../../hooks/useMenu";
import { useAuth } from "../../hooks/useAuth";
import { NavbarConnected, NavbarNoConnected } from "./NavbarAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { menu: menuCategories } = useMenu();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <nav className="relative">
      {/* Bouton menu avec animation d’icône */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 text-black cursor-pointer group"
        aria-label="Toggle menu"
      >
        <motion.div
          key={isOpen ? "vertical" : "horizontal"}
          initial={{ rotate: -90, opacity: 0, x: 5 }}
          animate={{ rotate: 0, opacity: 1, x: 0 }}
          exit={{ rotate: 90, opacity: 0, x: -5 }}
          transition={{ duration: 0.25 }}
          className="group-hover:-translate-x-1 transition-transform duration-300"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.div>
      </button>

      {/* Overlay + Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className="fixed top-0 right-0 h-full w-64 bg-gray-50 shadow-2xl z-80 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Bouton X */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="text-black cursor-pointer transition-colors duration-500 hover:text-gray-500"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Contenu */}
              <div className="flex flex-col flex-1">
                <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                  <span className="text-center py-2 font-extralight font-poppins tracking-widest text-lg md:text-xl transition-all duration-700 hover:underline hover:underline-offset-4 cursor-pointer mb-4">
                    <Link
                      to={"/"}
                      className="text-green-800"
                      onClick={() => setIsOpen(false)}
                    >
                      LearnArabic
                    </Link>
                  </span>

                  <div className="flex flex-col w-full gap-1">
                    <motion.div
                      whileHover="hover"
                      className="flex flex-row items-center transition-all duration-300 group px-4 py-1.5"
                    >
                      <Link
                        to="/category"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 font-poppins font-light text-sm sm:text-base tracking-wider group-hover:underline group-hover:underline-offset-4"
                      >
                        Explorer
                      </Link>
                      <motion.span
                        className="pr-6"
                        variants={{
                          hover: { x: -4 }, // <- animé quand le Link est survolé
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Compass size={20} />
                      </motion.span>
                    </motion.div>

                    {/* Catégories dynamiques */}
                    {menuCategories.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="flex flex-row items-center transition-all duration-300 group px-4 py-1.5"
                      >
                        <Link
                          to={"/category/" + item.slug}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 font-poppins font-light text-sm sm:text-base tracking-wider group-hover:underline group-hover:underline-offset-4"
                        >
                          {item.name}
                        </Link>
                        <motion.span
                          className="pr-6"
                          variants={{
                            hover: { x: -4 }, // <- animé quand le Link est survolé
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight size={22} />
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                  <div className=" mt-4 w-full">
                    {isAuthenticated ? (
                      <NavbarConnected onClick={() => setIsOpen(false)} />
                    ) : (
                      <NavbarNoConnected onClick={() => setIsOpen(false)} />
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
