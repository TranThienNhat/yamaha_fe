"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authUtils } from "@/utils/auth";
import { NguoiDung } from "@/types";

interface AppContextType {
  user: NguoiDung | null;
  setUser: (user: NguoiDung | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Chỉ chạy 1 lần khi mount
    const currentUser = authUtils.getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    authUtils.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = () => {
    const currentUser = authUtils.getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, isAuthenticated, logout, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
