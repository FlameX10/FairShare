import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

const authAPI = axios.create({
  baseURL: API_URL,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Set default axios header
  useEffect(() => {
    if (token) {
      authAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete authAPI.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("pendingEmail", email);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data || error.message;
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await authAPI.post("/api/auth/verify-otp", {
        email,
        otp,
      });
      const { token: jwtToken, user: userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("pendingEmail");
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data || error.message;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.post("/api/auth/login", {
        email,
        password,
      });
      const { token: jwtToken, user: userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data || error.message;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete authAPI.defaults.headers.common["Authorization"];
  };

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    // Only parse if storedUser is not null or undefined
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from storage:", error);
        localStorage.removeItem("user");
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    token,
    loading,
    register,
    verifyOtp,
    login,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
