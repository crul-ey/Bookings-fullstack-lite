import { useContext } from "react";
import { AuthContext } from "./auth-context";
import type { User } from "./AuthProvider";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: User | null;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
