/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // We can define custom colors here if needed, but Tailwind's default palette is usually sufficient.
                // The user mentioned "Green emerald color scheme". Emerald is a default tailwind color.
            }
        },
    },
    plugins: [],
}
