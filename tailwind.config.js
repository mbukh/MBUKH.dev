/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      fontSize: {
        base: 'clamp(16px, calc(1.56px + 1.56vw), 18px)',
        title: 'clamp(18px, calc(3.71px + 3.81vw), 22px)',
      },
      gap: {
        item: 'clamp(4px, calc(-5.09px + 2.42vw), 24px)',
      },
      backgroundColor: {
        primary: 'rgba(0, 0, 0, 1)',
      },
      gradientColorStops: {
        primary: 'rgba(0, 0, 0, 1)',
      },
      textColor: {
        primary: 'rgba(255, 255, 255, 0.64)',
        secondary: 'rgba(255, 255, 255, 0.5)',
        white: 'rgba(255, 255, 255, 1)',
      },
      transitionTimingFunction: {
        'image-grow': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
    },
  },
  plugins: [],
};
