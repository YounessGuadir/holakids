/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10233f',
        orange: '#ff6b35',
        teal: '#008f8c',
        sun: '#ffc857',
        sky: '#dff4ff',
        cream: '#fff9ef',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(16, 35, 63, 0.12)',
        card: '0 14px 36px rgba(16, 35, 63, 0.09)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'Inter', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

