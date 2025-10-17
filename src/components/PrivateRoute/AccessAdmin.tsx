import type { FC, ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const AccessAdmin: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={"/"} replace />;
  }

  if (user.role === "ADMIN") {
    return <>{children}</>;
  }
  return <Navigate to={"/dashboard"} />;
};

export default AccessAdmin;
