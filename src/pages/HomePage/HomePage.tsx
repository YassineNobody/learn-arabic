import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideInfos } from "../../components/Home/SectionHomePage";
import { SectionLastDocuments } from "../../components/Home/LastestDocuments";
import { BrowserHome } from "../../components/Home/BrowserHome";

export const HomePage = () => {
  const [view, setView] = useState<"intro" | "recent" | "browser">("intro");

  useEffect(() => {
    document.body.style.overflow = view === "intro" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [view]);

  const slides = [
    { id: "intro", label: "Accueil" },
    { id: "browser", label: "Explorer" },
    { id: "recent", label: "Récents" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white">
      {/* --- Boutons centrés --- */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {slides.map((s) => (
          <motion.button
            key={s.id}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setView(s.id as any)}
            className={`px-4 py-2 rounded-xl font-montserrat text-xs font-semibold transition-all duration-300 shadow-sm
              ${
                view === s.id
                  ? "bg-emerald-900 text-white"
                  : "bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50"
              }`}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      {/* --- Zone de slide --- */}
      <div className="relative w-full h-full flex-1">
        <AnimatePresence mode="wait">
          {view === "intro" && (
            <motion.div
              key="intro"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <SlideInfos />
            </motion.div>
          )}

          {view === "browser" && (
            <motion.div
              key="recent"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <BrowserHome />
            </motion.div>
          )}

          {view === "recent" && (
            <motion.div
              key="recent"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full"
            >
              <SectionLastDocuments />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
