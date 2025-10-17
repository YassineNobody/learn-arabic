import type { FC, ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const PrivateRouterLoginAndRegister: FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} />;
  }
  return <>{children}</>;
};
