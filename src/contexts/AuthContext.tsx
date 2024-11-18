import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, AuthState } from '../types';
import { getEmployees } from '../utils/storage';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string) => {
    const employees = getEmployees();
    const user = employees.find(emp => emp.email === email && emp.password === password);
    
    if (user) {
      setState({ user, isAuthenticated: true });
      toast.success(`Welcome back, ${user.name}!`);
    } else {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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