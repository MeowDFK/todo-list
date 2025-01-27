/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'JIT',
    content: [
        "./src/**/*.{html,js}",
        "./**/*.html",
        "./src/index.html",
      ],
    theme: {
        extend:{
            colors: {

            },
        },
    },
    plugins: [],
  }