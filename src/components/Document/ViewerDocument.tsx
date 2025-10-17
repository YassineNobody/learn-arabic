/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProgression } from "../../hooks/useProgression";
import { useModalConfirm } from "../../hooks/useModalConfirmation";
import { getDocumentBySlug } from "../../services/document";
import { navigateToDocument } from "../../utils/navigation";
import SpinnerLoader from "../Spinner/Loader";
import { ViewerPdfDocument } from "./ViewerPdfDocument";
import { ActionTypeDocument } from "./ActionTypeDocument";
import type { FC } from "react";
import type { ErrorResponse } from "../../interfaces/common/common";

interface ViewerDocumentProps {
  slug: string;
  categorySlug: string;
}

export const ViewerDocument: FC<ViewerDocumentProps> = ({
  slug,
  categorySlug,
}) => {
  const [selectedSlug, setSelectedSlug] = useState(slug);
  const hasPrompted = useRef<string | null>(null);
  const cacheRef = useRef<Map<string, any>>(new Map());
  const queryClient = useQueryClient();

  const { confirm, ConfirmDialog } = useModalConfirm();
  const { isClient, progression, addInProgress, addComplete } =
    useProgression();

  /**
   * ✅ Fetch avec cache local ET React Query v5 (optimisé)
   */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["document-by-slug", selectedSlug],
    queryFn: async () => {
      // 🧠 Vérifie d’abord le cache local
      if (cacheRef.current.has(selectedSlug)) {
        return cacheRef.current.get(selectedSlug);
      }

      // 🧠 Puis vérifie le cache global React Query
      const cached = queryClient.getQueryData<any>([
        "document-by-slug",
        selectedSlug,
      ]);
      if (cached) {
        cacheRef.current.set(selectedSlug, cached);
        return cached;
      }

      // 🌐 Sinon → fetch depuis le serveur
      const fetched = await getDocumentBySlug(selectedSlug);
      cacheRef.current.set(selectedSlug, fetched);
      return fetched;
    },
    staleTime: 1000 * 60 * 30, // 30 min de validité
    gcTime: 1000 * 60 * 60, // garde les données 1 h en mémoire
    placeholderData: (prevData) => prevData, // garde les données précédentes pendant le chargement
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 🧭 Navigation interne
  const changeDocument = async (newSlug: string) => {
    if (isClient && data) {
      const alreadyInProgress = progression?.inProgress?.some(
        (d) => d.slug === data.slug
      );
      const alreadyInComplete = progression?.complete?.some(
        (d) => d.slug === data.slug
      );

      if (!alreadyInProgress && !alreadyInComplete) {
        const shouldSave = await confirm({
          title: "📘 Enregistrer votre progression",
          message:
            "Souhaitez-vous enregistrer ce cours dans vos cours en progression avant de continuer ?",
          confirmText: "Oui, enregistrer",
          cancelText: "Non, continuer sans sauvegarde",
        });
        if (shouldSave) await addInProgress(data.slug);
      }
    }

    // 🚀 Précharge le prochain document pour instantanéité
    queryClient.prefetchQuery({
      queryKey: ["document-by-slug", newSlug],
      queryFn: () => getDocumentBySlug(newSlug),
      staleTime: 1000 * 60 * 30,
    });

    setSelectedSlug(newSlug);
    navigateToDocument(categorySlug, newSlug);
  };

  // 📚 Affiche la popup seulement si le cours n’est pas déjà suivi
  useEffect(() => {
    if (!isClient || !progression || !selectedSlug) return;

    const timer = setTimeout(() => {
      const alreadyInProgress = progression?.inProgress?.some(
        (d) => d.slug === selectedSlug
      );
      const alreadyInComplete = progression?.complete?.some(
        (d) => d.slug === selectedSlug
      );

      if (alreadyInProgress || alreadyInComplete) return;
      if (hasPrompted.current === selectedSlug) return;

      hasPrompted.current = selectedSlug;

      confirm({
        title: "📚 Commencer le cours",
        message: "Souhaitez-vous enregistrer votre progression pour ce cours ?",
        confirmText: "Oui, enregistrer",
        cancelText: "Non, juste lire",
      }).then(async (res) => {
        if (res) await addInProgress(selectedSlug);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedSlug, isClient, progression?.inProgress, progression?.complete]);

  // ⚙️ États de chargement / erreur
  if (isLoading && !data)
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <SpinnerLoader size={80} />
        <span className="text-lg font-bold tracking-wider font-montserrat">
          Chargement du document...
        </span>
      </div>
    );

  if (isError)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="text-red-600 font-bold font-montserrat tracking-wide text-lg">
          {(error as unknown as ErrorResponse).description ??
            "Erreur lors du chargement du document."}
        </span>
      </div>
    );

  if (!data) return null;

  const { name, description, urlPdf, category } = data;

  const inProgress = progression?.inProgress?.some((d) => d.slug === data.slug);
  const isCompleted = progression?.complete?.some((d) => d.slug === data.slug);

  return (
    <>
      <div className="flex flex-col items-center gap-4 px-4 py-6 relative">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl flex flex-col gap-3 lg:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-xl shadow-sm px-4 py-3"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 font-montserrat">
              {name}
            </h1>
            {description && (
              <p className="text-gray-600 italic font-light text-sm mt-1 max-w-2xl line-clamp-1">
                {description}
              </p>
            )}
          </div>

          <ActionTypeDocument
            name={name}
            urlPdf={urlPdf}
            categorySlug={category?.slug ?? categorySlug}
            currentSlug={selectedSlug}
            onSelect={changeDocument}
          />
        </motion.div>

        {/* ===== PDF Viewer ===== */}
        <ViewerPdfDocument data={data} />

        {/* ===== Bouton progression ===== */}
        {isClient && (inProgress || isCompleted) && (
          <motion.button
            onClick={async () => {
              if (!isCompleted) await addComplete(data.slug);
            }}
            whileTap={{ scale: 0.97 }}
            className={`fixed bottom-6 right-6 sm:right-10 z-50 px-5 py-3 text-sm rounded-full font-semibold font-montserrat shadow-md transition-all duration-300 flex items-center gap-2
              ${
                isCompleted
                  ? "bg-green-700 text-white cursor-default"
                  : "bg-emerald-900 text-white hover:bg-emerald-800"
              }`}
          >
            <CheckCircle2 size={20} />
            {isCompleted ? "Cours complété" : "Marquer comme terminé"}
          </motion.button>
        )}
      </div>

      <ConfirmDialog />
    </>
  );
};
