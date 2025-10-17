import { useNavigate } from "react-router-dom";
import type { AuthUser, User } from "../interfaces/user/user";
import { useContext, createContext, type ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { LoadingMessage } from "../components/Loader/LoadingMessage";
import { api } from "../services/api";
import { useLocalStorageState } from "./useLocalStorageState";
import type { ErrorResponse } from "../interfaces/common/common";

export interface AuthContextValue {
  user?: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  authenticate: (user: User, token: string) => void;
  refetchUser: (newToken?: string) => Promise<AuthUser>;
  logout: () => void;
  error: Error | ErrorResponse | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderContext {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderContext) => {
  const { value: tokenValue, persistValue: persistToken } =
    useLocalStorageState("auth");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const keyAuth = ["auth-user"];
  const isAuthenticated = !!tokenValue;

  /**
   * ✅ Requête utilisateur avec cache prolongé (1h)
   * - Jamais de refetch inutile
   * - Garde les données tant que le token est présent
   */
  const {
    data: auth,
    isLoading,
    isError,
    error,
  } = useQuery<User, Error>({
    queryKey: keyAuth,
    queryFn: async () => {
      const cached = queryClient.getQueryData<User>(keyAuth);
      if (cached) return cached;

      const rep = await api.currentUser(tokenValue);
      return rep.data.user;
    },
    retry: false,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60, // 1h
    gcTime: 1000 * 60 * 120, // 2h avant suppression
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev, // conserve les données précédentes
  });

  /**
   * 🧩 Setter utilisateur (instantané sans refetch)
   */
  const setUser = (user: User) => {
    queryClient.setQueryData(keyAuth, user);
  };

  /**
   * 🔐 Authentification → met à jour immédiatement le cache + token
   */
  const authenticate = (user: User, token: string) => {
    persistToken(token);
    queryClient.setQueryData(keyAuth, user);
  };

  /**
   * 🔄 Refetch user avec un nouveau token (utile après refresh du token)
   */
  const refetchUser = async (newToken?: string) => {
    const tokenToUse = newToken || tokenValue;
    if (!tokenToUse) throw new Error("Aucun token disponible.");

    // ⚠️ Si le token change, on purge l'ancien cache
    const cachedUser = queryClient.getQueryData<User>(keyAuth);
    if (newToken && newToken !== tokenValue && cachedUser) {
      queryClient.removeQueries({ queryKey: keyAuth });
    }

    const data = await queryClient.fetchQuery<AuthUser>({
      queryKey: keyAuth,
      queryFn: async () => {
        const resp = await api.currentUser(tokenToUse);
        queryClient.setQueryData(keyAuth, resp.data.user);
        return resp.data;
      },
      staleTime: 1000 * 60 * 60,
      retry: false,
    });

    return data;
  };

  /**
   * 🚪 Logout propre → n’efface que les caches auth liés
   */
  const logout = () => {
    api.logout();
    persistToken("");
    queryClient.removeQueries({ queryKey: keyAuth });
    navigate("/");
  };

  // 🕓 État de chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen justify-center flex items-center">
        <LoadingMessage />
      </div>
    );
  }

  // ⚠️ Si token invalide → déconnexion auto
  if (isError) {
    api.logout();
    persistToken("");
    queryClient.removeQueries({ queryKey: keyAuth });
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth,
        setUser,
        authenticate,
        logout,
        refetchUser,
        error: isError ? error : null,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
