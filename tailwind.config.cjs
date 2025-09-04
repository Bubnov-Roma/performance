/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        flash: {
          '0%': { backgroundColor: 'rgba(250, 204, 21, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        flash: 'flash 1.2s ease-out',
      },
    },
  },
  plugins: [],
};
