/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-0': '#0B0614',
        'bg-1': '#120A1C',
        'bg-2': '#1A1028',
        'bg-3': '#241836',
        primary: '#A855F7',
        pink: '#F472B6',
        cyan: '#22D3EE',
        'text': '#F5F0FF',
        'text-2': '#B8A9D4',
        success: '#34D399',
        danger: '#FB7185',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
    },
  },
  plugins: [],
}
