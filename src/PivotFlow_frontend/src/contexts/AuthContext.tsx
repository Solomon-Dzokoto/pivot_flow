import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

// Expose logout function globally for emergency use
declare global {
  interface Window {
    __pivotflow_logout: () => Promise<void>;
  }
}

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
      console.log('Checking auth status...');
      const isAuthenticated = await authService.isAuthenticated();
      console.log('Auth status result:', isAuthenticated);
      
      if (isAuthenticated) {
        const identity = authService.getIdentity();
        const principal = authService.getPrincipal();
        const authClient = authService.getAuthClient();
        console.log('User authenticated, principal:', principal?.toString());
        
        setAuthState({
          isAuthenticated: true,
          identity,
          principal,
          authClient,
        });
      } else {
        console.log('User not authenticated');
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
      console.log('Starting login process...');
      const success = await authService.login();
      console.log('Login result:', success);
      
      if (success) {
        const identity = authService.getIdentity();
        const principal = authService.getPrincipal();
        const authClient = authService.getAuthClient();
        console.log('Login successful, principal:', principal?.toString());
        
        setAuthState({
          isAuthenticated: true,
          identity,
          principal,
          authClient,
        });
        return true;
      }
      console.log('Login unsuccessful');
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
      console.log('Successfully logged out');
      // Force reload the page after logout
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false);
    }
  };

  // Expose the logout function globally
  useEffect(() => {
    window.__pivotflow_logout = logout;
  }, []);

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