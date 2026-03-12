module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0b1b41',
          900: '#121445',
          800: '#172554',
          700: '#1e3a8a',
          600: '#1d4ed8',
          400: '#60a5fa',
          100: '#dbeafe',
          50:  '#eff6ff',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeInUpSoft: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomSlow: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        fadeInUpSoft: 'fadeInUpSoft 0.7s ease-out forwards',
        fadeInUp:     'fadeInUp 0.5s ease-out forwards',
        zoomSlow:     'zoomSlow 10s ease-in-out infinite alternate',
        bounceSlow:   'bounceSlow 2.5s ease-in-out infinite',
      },
      boxShadow: {
        'brand-sm': '0 1px 3px 0 rgba(18, 20, 69, 0.15)',
        'brand':    '0 4px 16px 0 rgba(18, 20, 69, 0.18)',
        'brand-lg': '0 8px 32px 0 rgba(18, 20, 69, 0.22)',
      },
    },
  },
  plugins: [],
};
