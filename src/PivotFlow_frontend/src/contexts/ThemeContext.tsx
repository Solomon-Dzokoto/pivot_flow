import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'dark' | 'light'; // Actual theme being applied (dark or light)
};

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  effectiveTheme: 'dark', // Default to dark if system preference is unknown or not set
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark', // Changed default to 'dark' as per initial setup
  storageKey = 'vite-ui-theme', // Using a common key from shadcn/ui examples
}) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme && storedTheme !== 'system') {
      return storedTheme;
    }
    // If no theme is stored, or it's 'system', default to dark as per original setup
    // A more robust 'system' implementation would check window.matchMedia
    return defaultTheme === 'light' ? 'light' : 'dark';
  });


  useEffect(() => {
    const root = window.document.documentElement;
    let newEffectiveTheme: 'dark' | 'light';

    if (theme === 'system') {
      // For simplicity in this setup, 'system' will default to 'dark'.
      // A full implementation would use window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemPrefersDark = true; // Placeholder for actual system preference check
      newEffectiveTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      newEffectiveTheme = theme;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(newEffectiveTheme);
    setEffectiveTheme(newEffectiveTheme);
    localStorage.setItem(storageKey, theme); // Store the user's selected theme ('light', 'dark', or 'system')

  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
