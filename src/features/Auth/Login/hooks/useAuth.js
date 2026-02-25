import { useState } from "react";

import api from "../../../../shared/api/api";
import { useAuthStore } from "../../../../shared/stores/authStore";

export function useAuth() {
  const [error, setError] = useState(null);
  const { login, setLoading, logout, isLoading, isAuthenticated, user } =
    useAuthStore();

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/sign-in", { email, password });

      login(res.data);

      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect email or password");
      setLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      

      await api.post("/auth/logout"); 
    } catch (err) {
      console.error("Server logout failed", err);
    } finally {
      logout(); 
      document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setError(null);
      setLoading(false);
      
      window.location.href = '/login'; 
    }
  };

  return {
    signIn,
    signOut,
    loading: isLoading,
    error,
    isAuthenticated,
    user,
  };
}
