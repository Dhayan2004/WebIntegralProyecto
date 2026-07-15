import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F5F7FA',         
          card: '#FFFFFF',       
          border: '#E5E7EB',     
          cyan: '#0369A1',      
          'cyan-light': '#CFFAFE',  
          'cyan-muted': '#ECFEFF',  
          'cyan-hover': '#0891B2', 
          'cyan-dark': '#0E7490',  
        },
        dark: {
          title: '#111827',      
          body: '#4B5563',       
          muted: '#6B7280',     
        },
      },
    },
  },
  plugins: [],
} satisfies Config;