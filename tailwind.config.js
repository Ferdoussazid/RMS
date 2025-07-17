module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './assets/**/*.js',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        clean: '#ffffff',
        primary: '#3f51b5',
        secondary: '#ffeb3b',
        success: '#4caf50',
        danger: '#f44336',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('daisyui'), require('tailwind-scrollbar-hide')],
  daisyui: {
    darkTheme: 'light',
  },
}
