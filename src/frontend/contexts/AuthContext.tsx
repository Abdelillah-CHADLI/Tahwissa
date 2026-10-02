// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { syncLegacyIdsFromUser } from "../utils/session";
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  updateUser: (updates: Partial<User>) => void;
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
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          const userData: User = JSON.parse(savedUser);


          const isTraveller = userData?.profileType === 'traveller' || userData?.userType === 'traveller';
          if (isTraveller) {
            const travellerId = userData.profileId || userData.userId || userData.id;
            if (travellerId) {
              const stored = localStorage.getItem(`traveler_profile_picture:${travellerId}`);
              if (stored && stored !== userData.profile_picture) {
                userData.profile_picture = stored;
                // Persist the updated user object back to localStorage
                localStorage.setItem("user", JSON.stringify(userData));
              }
            }
          }
          const response = await api.get('/auth/session', { timeout: 60000 });
          const session = response.data;
          const role = String(session?.role || '').toLowerCase();
          const expectedType = role === 'admin' ? 'admin'
            : role === 'guide' ? 'guide'
            : role.includes('agency') ? 'agency' : 'traveller';
          if (String(session?.id) !== String(userData.id) || expectedType !== userData.userType) {
            throw new Error('Saved account does not match the server session.');
          }
          setUser(userData);
          syncLegacyIdsFromUser(userData);
        } catch (error) {
          console.warn("Session could not be restored", error);
          localStorage.removeItem("user");
          localStorage.removeItem('agencyId');
          localStorage.removeItem('profileId');
        }
      }
      setIsLoading(false);
    };

    void checkAuth();
  }, []);

  const login = (userData: User) => {
    if (!userData.id || !userData.email || !userData.userType) {
      console.error("AuthContext: incomplete user data during login", userData);
    }

    // For travellers, check if there's a stored profile picture from previous session
    const isTraveller = userData?.profileType === 'traveller' || userData?.userType === 'traveller';
    if (isTraveller && !userData.profile_picture) {
      const travellerId = userData.profileId || userData.userId || userData.id;
      if (travellerId) {
        const stored = localStorage.getItem(`traveler_profile_picture:${travellerId}`);
        if (stored) {
          userData.profile_picture = stored;
        }
      }
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    syncLegacyIdsFromUser(userData);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged: User = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(merged));
      syncLegacyIdsFromUser(merged);
      return merged;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("agencyId");
    localStorage.removeItem("profileId");
  };

  const value: AuthContextType = {
    user,
    login,
    updateUser,
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
