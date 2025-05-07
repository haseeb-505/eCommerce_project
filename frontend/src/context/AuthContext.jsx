import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../utils/AxiosApi";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return false;
      }
      const { data } = await axiosApi.get("/users/check-auth");
      setUser(data.user);
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    console.log("User after checkAuth:", user);
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axiosApi.post("/users/login", credentials);
      setUser(data.user);
      localStorage.setItem("token", data.token); // Store token
      console.log("User after checkAuth:", user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const logout = async () => {
    try {
      await axiosApi.post("/users/logout");
      setUser(null);
      localStorage.removeItem("token"); // Clear token
      toast.info("You have been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, // Added this computed property
      loading, 
      login, 
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};