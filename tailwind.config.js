/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f6',
          100: '#d7ece9',
          200: '#b0d9d3',
          300: '#87c5bc',
          400: '#69b3a9',
          500: '#4f9d93',
          600: '#3f827a',
          700: '#356a63',
          800: '#2b5551',
          900: '#234442',
        },
        navy: {
          50: '#eef1f4',
          100: '#d8dee6',
          200: '#b3bfcc',
          300: '#8b9db1',
          400: '#5e7590',
          500: '#455e78',
          600: '#3a4f66',
          700: '#34495e',
          800: '#2b3c4d',
          900: '#212f3d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
