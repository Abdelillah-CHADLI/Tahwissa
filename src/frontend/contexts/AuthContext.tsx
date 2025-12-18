// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log("🔄 AuthContext: Checking authentication...");
      const savedUser = localStorage.getItem("user");
      console.log("🔄 AuthContext: Saved user from localStorage:", savedUser);

      if (savedUser) {
        try {
          const userData: User = JSON.parse(savedUser);
          console.log("🔄 AuthContext: Parsed user data:", userData);
          setUser(userData);
        } catch (error) {
          console.error(
            "❌ AuthContext: Error parsing saved user data:",
            error
          );
          localStorage.removeItem("user");
        }
      } else {
        console.log("🔄 AuthContext: No saved user found");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    if (!userData.id || !userData.email || !userData.userType) {
      console.error(
        " AuthContext: Incomplete user data during login:",
        userData
      );
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log(" AuthContext: User stored in localStorage");
  };

  const logout = () => {
    console.log("AuthContext: Logout called");
    setUser(null);
    localStorage.removeItem("user");
    console.log("AuthContext: User removed from localStorage");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
