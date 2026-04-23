import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/axios';

// ── Create context
const AuthContext = createContext(null); // This will create a global box that will hold auth data

// ── Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null); 
  // user -> current value || setUser -> function to change value || null -> initial value 
  const [loading, setLoading] = useState(true); // true while we check the stored token

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
        // Token is invalid or expired — clean up
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Register
  const register = async (formData) => {
    const { data } = await api.register(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // ── Login
  const login = async (formData) => {
    const { data } = await api.login(formData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // ── Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Values exposed to the rest of the app
  const value = {
    user,
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

// ── Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
