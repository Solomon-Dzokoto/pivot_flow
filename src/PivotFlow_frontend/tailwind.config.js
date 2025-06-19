/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Existing HSL-based colors (likely for theming system)
        background: 'hsl(var(--background))', // This will likely be overridden by dark theme's primary in index.css
        foreground: 'hsl(var(--foreground))', // Default text color, will be overridden
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // primary, secondary, accent HSL might be for dynamic theming.
        // We are defining our own concrete dark theme palette here.
        // If the HSL vars --primary, --secondary, --accent are updated for dark mode elsewhere (e.g. in index.css via :root or .dark),
        // then these Tailwind definitions would pick them up.
        // For now, let's define our specific dark theme colors directly.
        // It's also possible these HSLs are intended to be replaced by our dark theme.

        // Dark Theme Palette
        'theme-primary': '#0F172A', // slate-900
        'theme-secondary': '#1E293B', // slate-800
        'theme-accent': '#00FFFF', // Cyan / Electric Blue (example)
        'theme-glow-start': '#00FFFF', // Accent color for glow
        'theme-glow-end': '#00A3FF', // A slightly different shade for glow gradient (example: lighter blue)
        'theme-text': '#CBD5E1', // slate-300 for general text
        'theme-text-muted': '#94A3B8', // slate-400 for muted text

        // Overriding or supplementing existing color names if needed,
        // or use the new names like 'theme-primary'.
        // For clarity, using new names. The HSL vars are likely for shadcn/ui's default light/dark theming.
        // We will set the actual CSS vars for --background, --foreground etc. in index.css for the dark theme.

        // Existing HSL-based color definitions from the original file:
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
