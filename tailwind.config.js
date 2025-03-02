/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4F46E5',
            dark: '#818CF8'
          },
          background: {
            light: '#FFFFFF',
            dark: '#1F2937'
          },
          surface: {
            light: '#F3F4F6',
            dark: '#374151'
          },
          text: {
            light: '#1F2937',
            dark: '#F9FAFB'
          }
        }
      },
    },
    plugins: [],
  }