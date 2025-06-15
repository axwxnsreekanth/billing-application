import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Popup/ToastProvider';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const {showToast}=useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means "loading"

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (err) {
    showToast("Logout Failed","error");

  } finally {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login'; 
  }
};

  if (isAuthenticated === null) {
    return null; // or show a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
