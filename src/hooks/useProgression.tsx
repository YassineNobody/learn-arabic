import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
  getProgression,
  updateProgression,
  deleteProgression,
} from "../services/progression";
import type { Progression } from "../interfaces/progression/progression";
import type { ErrorResponse } from "../interfaces/common/common";
import { useToast } from "./useToast"; // ✅ import du hook toast

export interface ProgressionContextValue {
  progression?: Progression;
  isClient: boolean;
  addInProgress: (slugDocument: string) => Promise<void>;
  addComplete: (slugDocument: string) => Promise<void>;
  addFavorite: (slugDocument: string) => Promise<void>;
  removeInProgress: (slugDocument: string) => Promise<void>;
  removeComplete: (slugDocument: string) => Promise<void>;
  removeFavorite: (slugDocument: string) => Promise<void>;
  error: Error | ErrorResponse | null;
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressionProvider = ({ children }: ProgressProviderProps) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const isClient = isAuthenticated && user?.role === "CLIENT";

  // 🔁 Récupération automatique de la progression
  const { data, error, isError } = useQuery({
    queryKey: ["progression-user"],
    queryFn: async () => await getProgression(),
    retry: false,
    enabled: isAuthenticated && isClient,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,

    refetchOnWindowFocus: false,
  });

  // ✅ Rafraîchir la progression
  const refreshProgression = async () => {
    await queryClient.invalidateQueries({ queryKey: ["progression-user"] });
  };

  // ➕ Ajouter un document en cours
  const addInProgress = async (slug: string) => {
    try {
      await updateProgression({ progress: slug });
      await refreshProgression();
      showSuccess({
        title: "📘 Lecture commencée !",
        description: "Le document a été ajouté à vos cours en progression.",
      });
    } catch {
      showError({
        title: "❌ Erreur",
        description: "Impossible d’ajouter ce document en progression.",
      });
    }
  };

  // ✅ Marquer comme terminé
  const addComplete = async (slug: string) => {
    try {
      await updateProgression({ complete: slug });
      await refreshProgression();
      showSuccess({
        title: "🎯 Félicitations !",
        description: "Vous avez terminé ce document avec succès 👏",
      });
    } catch {
      showError({
        title: "❌ Erreur",
        description: "Impossible de marquer ce document comme terminé.",
      });
    }
  };

  // ⭐ Ajouter aux favoris
  const addFavorite = async (slug: string) => {
    try {
      await updateProgression({ favorite: slug });
      await refreshProgression();
      showSuccess({
        title: "⭐ Ajouté aux favoris !",
        description: "Ce document a été ajouté à vos favoris.",
      });
    } catch {
      showError({
        title: "❌ Erreur",
        description: "Impossible d’ajouter ce document aux favoris.",
      });
    }
  };

  // ➖ Retirer des en cours
  const removeInProgress = async (slug: string) => {
    try {
      await deleteProgression({ progress: slug });
      await refreshProgression();
      showSuccess({
        title: "🗑️ Retiré",
        description: "Le document a été retiré de vos cours en progression.",
      });
    } catch {
      showError({
        title: "⚠️ Oups",
        description: "Impossible de retirer ce document de la progression.",
      });
    }
  };

  // ➖ Retirer des terminés
  const removeComplete = async (slug: string) => {
    try {
      await deleteProgression({ complete: slug });
      await refreshProgression();
      showSuccess({
        title: "🗑️ Supprimé",
        description: "Le document a été retiré de vos cours terminés.",
      });
    } catch {
      showError({
        title: "⚠️ Oups",
        description: "Impossible de retirer ce document des terminés.",
      });
    }
  };

  // ➖ Retirer des favoris
  const removeFavorite = async (slug: string) => {
    try {
      await deleteProgression({ favorite: slug });
      await refreshProgression();
      showSuccess({
        title: "💔 Retiré des favoris",
        description: "Ce document a été supprimé de vos favoris.",
      });
    } catch {
      showError({
        title: "⚠️ Oups",
        description: "Impossible de retirer ce document des favoris.",
      });
    }
  };

  // ⚙️ Valeur du contexte
  const value: ProgressionContextValue = {
    progression: data,
    isClient,
    addInProgress,
    addComplete,
    addFavorite,
    removeInProgress,
    removeComplete,
    removeFavorite,
    error: isError ? (error as unknown as ErrorResponse) : null,
  };

  if (!isClient) {
    const value: ProgressionContextValue = {
      progression: undefined,
      isClient,
      addInProgress: async () => {},
      addComplete: async () => {},
      addFavorite: async () => {},
      removeInProgress: async () => {},
      removeComplete: async () => {},
      removeFavorite: async () => {},
      error: null,
    };

    return (
      <ProgressionContext.Provider value={value}>
        {children}
      </ProgressionContext.Provider>
    );
  }

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
};

// 🔓 Hook personnalisé
// eslint-disable-next-line react-refresh/only-export-components
export const useProgression = (): ProgressionContextValue => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error(
      "useProgression doit être utilisé à l'intérieur de ProgressionProvider"
    );
  }
  return context;
};
