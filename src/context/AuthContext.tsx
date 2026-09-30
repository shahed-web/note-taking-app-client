import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
} from "../api/auth";

import type { AuthUser } from "../types/auth";
import { setAccessToken } from "../api/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const response = await refreshAccessToken();

      setAccessToken(response.data.accessToken);
      setAccessTokenState(response.data.accessToken);
      setUser(response.data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

    const login = async (credentials: LoginCredentials) => {
        const response = await loginRequest(credentials);

        setAccessToken(response.data.accessToken);
        setAccessTokenState(response.data.accessToken);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setAccessToken(null);
            setAccessTokenState(null);
            setUser(null);
        }
    };

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: user !== null && accessToken !== null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}