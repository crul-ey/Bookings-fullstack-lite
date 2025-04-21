import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("user" | "host" | "admin")[]; // optioneel
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // 🔐 Niet ingelogd → terug naar login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Wel ingelogd maar geen juiste rol
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
