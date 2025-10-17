import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Heart, Loader2 } from "lucide-react";
import { OtherDocumentByCategorySlug } from "./OtherDocumentByCategorySlug";
import { useProgression } from "../../hooks/useProgression";

interface ActionTypeDocumentProps {
  name: string;
  urlPdf: string;
  categorySlug?: string;
  currentSlug: string;
  onSelect: (slug: string) => void;
}

export const ActionTypeDocument = ({
  name,
  urlPdf,
  categorySlug,
  currentSlug,
  onSelect,
}: ActionTypeDocumentProps) => {
  const { isClient, addFavorite, removeFavorite, progression } = useProgression();
  const [isDownloading, setIsDownloading] = useState(false);

  // 🔎 Vérifie si le document est déjà dans les favoris
  const isFavorite =
    progression?.favorites?.some((doc) => doc.slug === currentSlug) ?? false;

  // ❤️ Toggle favori
  const handleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(currentSlug);
    } else {
      await addFavorite(currentSlug);
    }
  };

  // 📥 Télécharger le document
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(urlPdf);
      if (!response.ok) throw new Error("Erreur lors du téléchargement du PDF");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${name || "document"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("❌ Impossible de télécharger le document pour le moment.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
      {/* ❤️ Bouton favoris (client uniquement) */}
      {isClient && (
        <motion.button
          onClick={handleFavorite}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 font-medium px-3 py-1.5 rounded-lg shadow transition ${
            isFavorite
              ? "bg-rose-500 hover:bg-rose-600 text-white"
              : "bg-gray-200 hover:bg-rose-400 hover:text-white text-gray-700"
          }`}
        >
          <motion.div
            animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-white" : "fill-none"}
            />
          </motion.div>
          <span className="text-sm font-poppins tracking-wide">
            {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </span>
        </motion.button>
      )}

      {/* 📥 Bouton téléchargement */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        disabled={isDownloading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-lg shadow transition disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            <Download size={20} />
            <span className="text-sm font-poppins tracking-wide">
              Télécharger
            </span>
          </>
        )}
      </motion.button>

      {/* 📚 Autres documents */}
      {categorySlug && (
        <OtherDocumentByCategorySlug
          currentSlug={currentSlug}
          categorySlug={categorySlug}
          onSelect={onSelect}
        />
      )}
    </div>
  );
};
