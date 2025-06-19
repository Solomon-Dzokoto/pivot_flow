import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button'; // Assuming a Shadcn UI like Button component exists

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, effectiveTheme } = useTheme();

  const toggleTheme = () => {
    // Cycle: light -> dark -> system (optional, for now just light/dark)
    // For simplicity, directly toggle between light and dark
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };

  // If you want to support 'system' theme explicitly in toggle:
  // const cycleTheme = () => {
  //   if (theme === 'light') setTheme('dark');
  //   else if (theme === 'dark') setTheme('system');
  //   else setTheme('light');
  // };

  return (
    <Button
      variant="ghost" // Assuming ghost variant for icon buttons
      size="icon" // Assuming icon size for icon buttons
      onClick={toggleTheme}
      aria-label={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`}
      className="rounded-full p-2 transition-colors duration-300 hover:bg-secondary/80"
    >
      {effectiveTheme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
};
