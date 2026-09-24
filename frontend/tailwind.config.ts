import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        morado: '#545386',
        rosado: '#F4C7CE',
        'rosado-deep': '#C24C64',
        azul: '#C2DFEA',
        gris: '#383A35',
        beige: '#D8D2C4',
        // Not part of the Section 5 brand palette — a deliberate exception for the Rating field's
        // filled stars, which read as a star rating far better in the conventional gold than in
        // brand purple. Mirrors the Form Builder mockup's --gold.
        gold: '#E8A317',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
