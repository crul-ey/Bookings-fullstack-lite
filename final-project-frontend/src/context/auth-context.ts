import { createContext, useContext } from "react";
import { User } from "./AuthProvider";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth moet binnen een AuthProvider gebruikt worden");
  return context;
}
