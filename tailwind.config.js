/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf2ff',
          100: '#dbe4ff',
          200: '#c0cfff',
          300: '#92abff',
          400: '#637eff',
          500: '#3d5afe',
          600: '#2a3ff5',
          700: '#1e31e0',
          800: '#1e2db6',
          900: '#1e298e',
        },
        dark: {
          100: '#d1d5db',
          200: '#9ca3af',
          300: '#6b7280',
          400: '#4b5563',
          500: '#374151',
          600: '#1f2937',
          700: '#111827',
          800: '#0d1425',
          900: '#030712',
        },
        success: {
          light: '#86efac',
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          light: '#fde68a',
          DEFAULT: '#eab308',
          dark: '#854d0e',
        },
        error: {
          light: '#f87171',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 5px rgba(61, 90, 254, 0.5)' },
          '100%': { 'box-shadow': '0 0 20px rgba(61, 90, 254, 0.8)' }
        }
      },
      boxShadow: {
        'neon': '0 0 10px rgba(61, 90, 254, 0.5), 0 0 20px rgba(61, 90, 254, 0.3)',
        'neon-hover': '0 0 15px rgba(61, 90, 254, 0.6), 0 0 30px rgba(61, 90, 254, 0.4)',
      },
    },
  },
  plugins: [],
};