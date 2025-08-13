import { useState, useEffect } from 'react';
import { AppSettings } from '@/types/drug';

const DEFAULT_SETTINGS: AppSettings = {
  preferredWeightUnit: 'kg',
  darkMode: false,
  favorites: [],
  recentDrugs: []
};

const STORAGE_KEY = 'pediatric-drug-calculator-settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage when they change
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addToFavorites = (drugId: string) => {
    setSettings(prev => ({
      ...prev,
      favorites: prev.favorites.includes(drugId) 
        ? prev.favorites 
        : [...prev.favorites, drugId]
    }));
  };

  const removeFromFavorites = (drugId: string) => {
    setSettings(prev => ({
      ...prev,
      favorites: prev.favorites.filter(id => id !== drugId)
    }));
  };

  const toggleFavorite = (drugId: string) => {
    if (settings.favorites.includes(drugId)) {
      removeFromFavorites(drugId);
    } else {
      addToFavorites(drugId);
    }
  };

  const addToRecent = (drugId: string) => {
    setSettings(prev => {
      const filtered = prev.recentDrugs.filter(id => id !== drugId);
      const updated = [drugId, ...filtered].slice(0, 10); // Keep only last 10
      return { ...prev, recentDrugs: updated };
    });
  };

  const clearRecent = () => {
    setSettings(prev => ({ ...prev, recentDrugs: [] }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return {
    settings,
    updateSettings,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    addToRecent,
    clearRecent,
    toggleDarkMode,
    isLoaded
  };
}