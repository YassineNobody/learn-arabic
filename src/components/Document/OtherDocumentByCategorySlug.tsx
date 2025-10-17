/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getDocumentByCategorySlug } from "../../services/document";

type Props = {
  currentSlug: string;
  categorySlug: string;
  onSelect: (slug: string) => void;
};

export const OtherDocumentByCategorySlug = ({
  currentSlug,
  categorySlug,
  onSelect,
}: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const prefetchTriggered = useRef(false);

  /**
   * 🧠 useInfiniteQuery avec cache + placeholderData
   * → évite le refetch si déjà chargé
   * → garde les données affichées pendant le chargement
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["related-docs", categorySlug],
    queryFn: async ({ pageParam = 0 }) => {
      const cachedPage = queryClient.getQueryData<any>([
        "related-docs",
        categorySlug,
        pageParam,
      ]);
      if (cachedPage) return cachedPage;

      const fetched = await getDocumentByCategorySlug(
        categorySlug,
        pageParam.toString(),
        "10"
      );
      queryClient.setQueryData(["related-docs", categorySlug, pageParam], fetched);
      return fetched;
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      return !meta.last && meta.page + 1 < meta.totalPages
        ? meta.page + 1
        : undefined;
    },
    initialPageParam: 0,
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 30, // 30 min
    gcTime: 1000 * 60 * 60, // 1h
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (prev) => prev, // garde l’ancien contenu pendant un refresh
  });

  // 📚 Fusion de toutes les pages déjà chargées
  const docs = data?.pages.flatMap((p) => p.content) ?? [];

  // 🔮 Préchargement de la prochaine page (anticipation)
  useEffect(() => {
    if (!hasNextPage || prefetchTriggered.current) return;
    prefetchTriggered.current = true;

    const lastPage = data?.pages?.[data.pages.length - 1];
    const nextPage =
      lastPage && typeof lastPage.meta?.page === "number"
        ? lastPage.meta.page + 1
        : undefined;

    if (nextPage !== undefined) {
      queryClient.prefetchQuery({
        queryKey: ["related-docs", categorySlug, nextPage],
        queryFn: () =>
          getDocumentByCategorySlug(categorySlug, nextPage.toString(), "10"),
        staleTime: 1000 * 60 * 30,
      });
    }
  }, [data?.pages, hasNextPage, categorySlug, queryClient]);

  // 🔒 Fermer le menu si clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // ⚡ Optionnel : précharger à l’ouverture du menu
  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev);
    if (!open && hasNextPage && !isFetchingNextPage) {
      // on précharge la page suivante quand on ouvre le menu
      fetchNextPage();
    }
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleOpen}
        className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg shadow transition disabled:opacity-50"
      >
        <span className="text-sm font-poppins tracking-wide">Menu</span>
        <EllipsisVertical size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-10 w-64 max-h-[70vh] overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              Autres documents
            </div>

            {isLoading ? (
              <p className="px-4 py-3 text-sm text-gray-500">Chargement...</p>
            ) : docs.length > 0 ? (
              <>
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setOpen(false);
                      onSelect(doc.slug);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition hover:bg-gray-50 ${
                      doc.slug === currentSlug
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {doc.name}
                  </button>
                ))}

                {/* === Bouton Voir plus === */}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 border-t border-gray-100"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Chargement...
                      </>
                    ) : (
                      "Voir plus"
                    )}
                  </button>
                )}
              </>
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500 italic">
                Aucun autre document
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
