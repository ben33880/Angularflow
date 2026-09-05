/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f172a',
          secondary: '#1e293b',
          card: '#334155',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
        },
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse': 'pulse 2s infinite',
        'glow': 'glow 2s infinite',
        'spin': 'spin 0.8s linear infinite',
        'rotate': 'rotate 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
