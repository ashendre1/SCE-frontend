import React, { createContext, useState, useContext } from 'react';
import { logout } from '../ApiService/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logoutcall = async (navigate) => {
    try {
      await logout();
      setIsLoggedIn(false);
      console.log('Logged out');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logoutcall }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);