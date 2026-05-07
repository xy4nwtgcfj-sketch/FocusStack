/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4F6BFF',
        'brand-light': '#EEF1FF',
        'brand-muted': '#C7D0FF',
      },
    },
  },
  plugins: [],
};
