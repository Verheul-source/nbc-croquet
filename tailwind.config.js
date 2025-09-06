/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ONLY App Router directories - remove Pages Router references
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // Remove: './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-emerald-900',
    'bg-emerald-800', 
    'bg-emerald-700',
    'text-amber-100',
    'text-amber-200',
    'border-amber-400',
    'bg-gradient-to-r',
    'from-emerald-900',
    'via-emerald-800',
    'to-emerald-900'
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['serif'],
        'body': ['sans-serif']
      },
      colors: {
        // Define custom emerald and amber shades
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      }
    }
  },
  plugins: []
}