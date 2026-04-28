import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(undefined);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch favorites from backend when authenticated
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.getFavorites();
      setFavorites(data.data || data.favorites || (Array.isArray(data) ? data : []));
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (service) => {
    if (!isAuthenticated) return;

    const exists = favorites.find(
      (s) => String(s.service_id || s.id) === String(service.id)
    );

    if (exists) {
      // Remove
      try {
        await api.removeFavorite(service.id);
        setFavorites((prev) =>
          prev.filter(
            (s) => String(s.service_id || s.id) !== String(service.id)
          )
        );
      } catch (err) {
        console.error('Failed to remove favorite', err);
      }
    } else {
      // Add
      try {
        await api.addFavorite({ service_id: service.id });
        setFavorites((prev) => [...prev, { ...service, service_id: service.id }]);
      } catch (err) {
        console.error('Failed to add favorite', err);
      }
    }
  };

  const isFavorite = (id) =>
    favorites.some(
      (s) => String(s.service_id || s.id) === String(id)
    );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
