import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./auth-context";

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: "user" | "host" | "admin";
  phoneNumber?: string | null;
  profilePicture?: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [user, setUser] = useState<User | null>(null);

  const login = async () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);

    try {
      const res = await fetch("http://localhost:3000/auth/profile", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!data || !data.id) {
        throw new Error("Profiel ophalen mislukt");
      }

      setUser(data);
    } catch (error) {
      console.error("❌ Fout bij ophalen profiel:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (isAuthenticated && !user) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
