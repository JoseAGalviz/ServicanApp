import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/Config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    checkStoredSession();
  }, []);

  const checkStoredSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER);
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error('Session check error:', e);
    } finally {
      setIsSplashLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const { DEFAULT_USER } = Config;
      if (
        username.trim().toLowerCase() === DEFAULT_USER.username &&
        password === DEFAULT_USER.password
      ) {
        const userInfo = {
          id:       '1',
          username: DEFAULT_USER.username,
          nombre:   DEFAULT_USER.nombre,
          rol:      DEFAULT_USER.rol,
        };
        await AsyncStorage.setItem(Config.STORAGE_KEYS.USER, JSON.stringify(userInfo));
        setUser(userInfo);
        return { success: true };
      }
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    } catch (e) {
      return { success: false, error: 'Error al iniciar sesión.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isSplashLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
