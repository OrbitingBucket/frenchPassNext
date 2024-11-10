// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3b82f6',
          success: '#22c55e',
          error: '#ef4444',
          neutral: '#6b7280',
        },
        fontSize: {
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
        },
        spacing: {
          '18': '4.5rem',
        },
      },
    },
    plugins: [],
  }
  