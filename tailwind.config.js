/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Semantic Theme Colors
                theme: {
                    bg: '#020617',         // slate-950 (Main background)
                    surface: '#0f172a',    // slate-900 (Cards, Headers)
                    surfaceHover: '#1e293b', // slate-800
                    border: '#334155',     // slate-700
                    text: {
                        main: '#f1f5f9',   // slate-100
                        muted: '#94a3b8',  // slate-400
                        dim: '#64748b',    // slate-500
                    },
                    accent: {
                        base: '#6366f1',   // indigo-500
                        hover: '#4f46e5',  // indigo-600
                        glow: 'rgba(99, 102, 241, 0.5)',
                    }
                }
            }
        },
    },
    plugins: [],
}
