import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, verifyAuth } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const authData = await verifyAuth();
          if (authData.authenticated) {
            setUser({ username: authData.username });
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await loginApi(username, password);
      
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', response.username);
        setUser({ username: response.username });
        return { success: true };
      } else {
        setError('Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 