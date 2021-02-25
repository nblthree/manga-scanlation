module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      color: {
        grey: {
          1: '#909090',
          2: '#808080',
          3: '#707070',
          4: '#606060',
          5: '#505050',
          6: '#404040',
          7: '#303030',
          8: '#202020',
          9: '#202020',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
