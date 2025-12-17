import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth.tsx";

interface Props {
  children: JSX.Element;
}

export const AdminGuard = ({ children }: Props) => {
  const { user, loading } = useAuth();

  // Auth bilgisi yüklenirken bekle
  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>;
  }

  // Giriş yoksa veya admin değilse → login
  if (!user || user.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};
    