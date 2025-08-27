import React, { createContext, useEffect, useState } from 'react';

type AuthUser = Record<string, unknown> | null;

type AuthContextValue = {
  token: string | null;
  user: AuthUser;
  login: (newToken: string, newUser: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );
  const [user, setUser] = useState<AuthUser>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('user');
    try {
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      const storedUser = localStorage.getItem('user');
      try {
        setUser(storedUser ? (JSON.parse(storedUser) as AuthUser) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
