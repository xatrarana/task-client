import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types"
import { api } from "../services/api"
import { AxiosError } from "axios";

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || sessionStorage.getItem("token"))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  // Check sessionStorage on initial load
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Sync token with sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/auth/login", { username, password });
      const { user, token } = response.data;
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
      setUser(user);
      setToken(token);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.error || "Failed to login");
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/register", { username, password });
    } catch (err: any) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    } catch (err: any) {
      setError(err.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
