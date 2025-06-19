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
      className="rounded-full p-2 transition-all duration-300 hover:bg-secondary/80 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Using a key on the span makes React treat them as distinct elements, helping with transitions if CSS is set up for enter/exit based on presence.
          However, for a simple rotate/fade, we can rely on the direct change of className.
          The `effectiveTheme` change will swap the icon, and CSS can handle the transition of the icon itself if needed,
          but here we are swapping the component. A more fluid CSS-only animation would have both icons present and toggle visibility/transform.
          For this case, the button's own transition and the icon swap will be the primary visual feedback.
          To enhance the icon swap itself, we can add a subtle animation to the icons.
      */}
      <span className="relative flex items-center justify-center h-5 w-5">
        <Sun
          className={`absolute h-5 w-5 text-foreground transition-all duration-500 ease-in-out ${
            effectiveTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 text-foreground transition-all duration-500 ease-in-out ${
            effectiveTheme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
        />
      </span>
    </Button>
  );
};
