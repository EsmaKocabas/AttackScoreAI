import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import * as authApi from "../api/auth.api";

interface User {
  appuserid: number;
  kullaniciadi: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, sifrehash: string) => Promise<void>;
  register: (
    kullaniciadi: string,
    email: string,
    sifrehash: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * PROVIDER
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sayfa yenilendiğinde localStorage'dan auth bilgisini al
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * LOGIN
   */
  const login = async (email: string, sifrehash: string) => {
    const data = await authApi.login({ email, sifrehash });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  /**
   * REGISTER
   */
  const register = async (
    kullaniciadi: string,
    email: string,
    sifrehash: string
  ) => {
    const data = await authApi.register({
      kullaniciadi,
      email,
      sifrehash,
      rol: "user",
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  /**
   * LOGOUT
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * HOOK
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

