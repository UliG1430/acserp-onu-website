module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUpSoft: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        fadeInUpSoft: 'fadeInUpSoft 0.8s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
