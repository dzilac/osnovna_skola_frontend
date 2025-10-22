// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData treba da sadrži token iz backend-a
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Helper funkcija za API pozive sa token-om
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Ako je token istekao
    if (response.status === 401) {
      logout();
      window.location.href = '/login';
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);