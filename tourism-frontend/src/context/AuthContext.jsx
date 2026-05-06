import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — if a token exists, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Register — calls the real backend
  const register = async (formData) => {
    const { data } = await api.register(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // Login — calls the real backend
  const login = async (formData) => {
    const { data } = await api.login(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
