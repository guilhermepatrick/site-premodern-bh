/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pm-bg':          '#1A1613',
        'pm-bg-2':        '#241E18',
        'pm-green':       '#5C7A3E',
        'pm-green-deep':  '#3A4F26',
        'pm-green-hi':    '#7A9C57',
        'pm-parchment':   '#E8DCC0',
        'pm-parchment-2': '#D4C59E',
        'pm-brown':       '#8B6F47',
        'pm-brown-deep':  '#5C4830',
        'pm-frame':       '#3D2F1F',
        'pm-gold':        '#C9A961',
        'pm-gold-hi':     '#E8C472',
        'pm-ink':         '#1F1A14',
        'pm-cream':       '#F5EFD8',
      },
      fontFamily: {
        title: ['Cinzel', 'serif'],
        body:  ['"EB Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'old-frame':       'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #8B6F47, inset 0 0 0 6px #3D2F1F',
        'old-frame-gold':  'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #C9A961, inset 0 0 0 6px #3D2F1F',
        'old-frame-green': 'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #5C7A3E, inset 0 0 0 6px #3D2F1F',
        'card-lift':       '0 8px 24px rgba(0,0,0,0.55)',
        'pt-box':          'inset 0 0 0 2px #1F1A14, 0 2px 4px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'parchment':  'radial-gradient(ellipse at center, #EFE4C9 0%, #D4C59E 100%)',
        'dark-grain': 'radial-gradient(ellipse at top, #2A2218 0%, #120F0B 100%)',
      },
    },
  },
  plugins: [],
};
