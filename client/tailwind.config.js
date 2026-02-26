/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'suloc-blue': {
                    DEFAULT: '#002349',
                    dark: '#001a33',
                    light: '#003366',
                },
                'suloc-gold': {
                    DEFAULT: '#C5A059',
                    dark: '#A67C37',
                    light: '#D4AF37',
                },
                'navy': {
                    DEFAULT: '#002349',
                    light: '#003366',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
