import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2B4C',
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9fb0d4',
          300: '#7890c2',
          400: '#5b78b5',
          500: '#3e5fa8',
          600: '#34539a',
          700: '#284487',
          800: '#1e3675',
          900: '#1A2B4C',
        },
        teal: {
          DEFAULT: '#00C2B8',
          50: '#e0faf9',
          100: '#b3f3f0',
          200: '#80ece7',
          300: '#4de4dd',
          400: '#26ded6',
          500: '#00C2B8',
          600: '#00b0a7',
          700: '#009990',
          800: '#00837a',
          900: '#005f57',
        },
        offwhite: '#F5F5F0',
        charcoal: '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'card': '0 2px 16px rgba(26, 43, 76, 0.08)',
        'card-hover': '0 8px 32px rgba(26, 43, 76, 0.16)',
        'teal': '0 4px 20px rgba(0, 194, 184, 0.3)',
      },
    },
  },
  plugins: [typography],
}
