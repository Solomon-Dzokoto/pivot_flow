import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { authService, AuthState } from '../lib/auth';

interface AuthContextType extends AuthState {
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    identity: null,
    principal: null,
    authClient: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const identity = authService.getIdentity();
        const principal = authService.getPrincipal();
        const authClient = authService.getAuthClient();
        
        setAuthState({
          isAuthenticated: true,
          identity,
          principal,
          authClient,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          identity: null,
          principal: null,
          authClient: null,
        });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setAuthState({
        isAuthenticated: false,
        identity: null,
        principal: null,
        authClient: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await authService.login();
      
      if (success) {
        const identity = authService.getIdentity();
        const principal = authService.getPrincipal();
        const authClient = authService.getAuthClient();
        
        setAuthState({
          isAuthenticated: true,
          identity,
          principal,
          authClient,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        identity: null,
        principal: null,
        authClient: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};