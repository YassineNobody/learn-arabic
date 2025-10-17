/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, type FC } from "react";
import type { Category } from "../../interfaces/category/category";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getDocumentByCategorySlug } from "../../services/document";
import { motion, AnimatePresence } from "framer-motion";
import { CardBoxDocument } from "./CardBoxDocument";
import type { Document } from "../../interfaces/document/document";

export const BoxDocumentBySlug: FC<{ category: Category }> = ({ category }) => {
  const { slug } = category;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const prefetchTriggered = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["documents", slug],
    queryFn: async ({ pageParam = 0 }) => {
      // Vérifie si la page est déjà dans le cache avant de refetch
      const cachedPage = queryClient.getQueryData<any>([
        "documents",
        slug,
        pageParam,
      ]);
      if (cachedPage) return cachedPage;

      const fetched = await getDocumentByCategorySlug(
        slug,
        pageParam.toString(),
        "20"
      );
      // Stocke la page dans le cache global (par page pour réutilisation)
      queryClient.setQueryData(["documents", slug, pageParam], fetched);
      return fetched;
    },
    getNextPageParam: (lastPage) => {
      const {
        meta: { page, totalPages, last },
      } = lastPage;
      return !last && page + 1 < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!slug,
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 min : pas de refetch pendant ce délai
    gcTime: 1000 * 60 * 60, // garde les données 1h
    refetchOnWindowFocus: false,
  });

  // 🔮 Préchargement de la prochaine page à l’avance (anticipation)
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
        queryKey: ["documents", slug, nextPage],
        queryFn: () =>
          getDocumentByCategorySlug(slug, nextPage.toString(), "20"),
        staleTime: 1000 * 60 * 30,
      });
    }
  }, [data?.pages, hasNextPage, slug, queryClient]);

  // ⚡ Intersection Observer : déclenche le fetch quand visible
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "300px", // augmente la marge de préchargement
      threshold: 0.5,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 🌀 Loader squelettes pendant le premier chargement
  if (isLoading)
    return (
      <motion.div
        className="flex flex-col gap-3 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </motion.div>
    );

  // ⚠️ Gestion d’erreur simple
  if (error)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 text-center mt-10"
      >
        Une erreur est survenue.
      </motion.p>
    );

  // 🕳️ Aucun document
  const noDocuments =
    !data?.pages?.length ||
    data.pages.every((page) => page.content.length === 0);

  if (noDocuments)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-500 text-center mt-10"
      >
        Aucun document disponible pour cette catégorie.
      </motion.p>
    );

  // ✅ Affichage principal
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {data?.pages.map((page, i) =>
            page.content.map((doc: Document) => (
              <CardBoxDocument key={`${doc.id}-${i}`} doc={doc} />
            ))
          )}
        </div>
      </AnimatePresence>

      {/* Élément observé pour charger plus */}
      <div ref={observerRef} className="h-8" />

      {isFetchingNextPage && (
        <motion.div
          className="flex justify-center py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          />
        </motion.div>
      )}
    </div>
  );
};
