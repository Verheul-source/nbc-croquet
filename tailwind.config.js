/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
  ]
  // Note: In Tailwind v4, theme configuration is now in CSS using @theme
  // The colors are defined in your globals.css file instead
}