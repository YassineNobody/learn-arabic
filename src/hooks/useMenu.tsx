import { createContext, useContext, type ReactNode } from "react";
import type { Category } from "../interfaces/category/category";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getParentCategories } from "../services/category";

export type MenuValueContext = {
  menu: Category[];
  error: Error | null | unknown;
};

// eslint-disable-next-line react-refresh/only-export-components
export const MenuContext = createContext<MenuValueContext | null>(null);
MenuContext.displayName = "MenuContext";

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const { data, isError, error } = useSuspenseQuery({
    queryKey: ["menu"],
    queryFn: async () => await getParentCategories(),
    retry: false,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return (
    <MenuContext.Provider
      value={{
        menu: data.data,
        error: isError ? error : null,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
