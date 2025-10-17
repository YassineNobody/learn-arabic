import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const SlideInfos = () => {
  const slides = [
    {
      title: "Apprends l’arabe pas à pas",
      text: "Une méthode simple, progressive et interactive pour maîtriser l’arabe, depuis les bases jusqu’aux notions avancées.",
      gradient: "from-emerald-200 to-emerald-400",
      color: "text-emerald-900",
    },
    {
      title: "Des cours clairs et illustrés",
      text: "Chaque leçon est expliquée en français, avec des exemples, de l’arabe vocalisé et des exercices adaptés.",
      gradient: "from-blue-200 to-indigo-300",
      color: "text-indigo-900",
    },
    {
      title: "Apprends à ton rythme",
      text: "Progresse à ton rythme, sauvegarde tes favoris et reprends là où tu t’étais arrêté.",
      gradient: "from-purple-200 to-pink-200",
      color: "text-purple-900",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: "easeInOut" as any, // ✅ typé et fluide
      },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-y-scroll snap-y snap-proximity scroll-smooth">
      {slides.map((slide, index) => (
        <section
          key={index}
          className={`snap-center flex flex-col items-center justify-center h-screen w-full bg-gradient-to-b ${slide.gradient} ${slide.color} text-center px-4`}
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-bold font-montserrat tracking-tight drop-shadow-sm">
              {slide.title}
            </h2>

            <p className="text-lg sm:text-xl max-w-2xl font-light mx-auto leading-relaxed opacity-90">
              {slide.text}
            </p>
          </motion.div>

          {/* ↓ Indicateur de scroll ↓ */}
          {index < slides.length - 1 && (
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              }}
              className="absolute bottom-10 flex flex-col items-center text-sm font-semibold text-black/70"
            >
              <span>Fais défiler</span>
              <ChevronDown size={22} className="mt-1" />
            </motion.div>
          )}
        </section>
      ))}
    </div>
  );
};
