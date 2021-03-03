module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: '#1c1c1c',
      secondary: '#e0e0e0',
    },
    extend: {
      colors: {
        grey: {
          50: '#a0a0a0',
          100: '#909090',
          200: '#808080',
          300: '#707070',
          400: '#606060',
          500: '#505050',
          600: '#404040',
          700: '#303030',
          800: '#202020',
          900: '#202020',
        },
      },
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
        crosshair: 'crosshair',
        none: 'none',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover', 'group-focus'],
    },
  },
  plugins: [],
}
