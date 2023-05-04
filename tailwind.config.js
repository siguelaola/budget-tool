/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        colors: {
            brand: "#695bff",
            primary: 'rgb(23, 0, 70)',
            background: '#F2F2F7',
            secondarybg: '#d5d5ff'
        }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

