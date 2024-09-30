/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Agregamos esta línea para incluir archivos de React
    "./node_modules/flowbite/**/*.js", // Agregamos esta línea para incluir Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Importamos el plugin de Flowbite
  ],
};
