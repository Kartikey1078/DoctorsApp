/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"  // make sure your JSX files are included
    ],
    theme: {
      extend: {
        colors: {
          primary: "#5f6fff",  // your custom color
        },
      },
    },
  }
  