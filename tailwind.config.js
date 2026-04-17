/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premodern (public site)
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
        // Vault Admin (admin area)
        'vc-bg':      '#0D0D0F',
        'vc-bg-2':    '#161618',
        'vc-bg-3':    '#1E1E21',
        'vc-blue':    '#1A6DB5',
        'vc-blue-hi': '#2B8FE8',
        'vc-blue-dim':'#0F4A7A',
        'vc-cyan':    '#00B4D8',
        'vc-white':   '#F0F0F0',
        'vc-muted':   '#8A8A9A',
        'vc-border':  '#242428',
        'vc-border-2':'#303038',
      },
      fontFamily: {
        title: ['Rajdhani', 'Cinzel', 'serif'],
        body:  ['Inter', '"EB Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'old-frame':       'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #8B6F47, inset 0 0 0 6px #3D2F1F',
        'old-frame-gold':  'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #C9A961, inset 0 0 0 6px #3D2F1F',
        'old-frame-green': 'inset 0 0 0 2px #1F1A14, inset 0 0 0 4px #5C7A3E, inset 0 0 0 6px #3D2F1F',
        'card-lift':       '0 8px 24px rgba(0,0,0,0.55)',
        'pt-box':          'inset 0 0 0 2px #1F1A14, 0 2px 4px rgba(0,0,0,0.6)',
        'vc-card': '0 4px 20px rgba(0,0,0,0.6)',
        'vc-blue': '0 0 20px rgba(26,109,181,0.35)',
        'vc-cyan': '0 0 16px rgba(0,180,216,0.25)',
      },
      backgroundImage: {
        'parchment':  'radial-gradient(ellipse at center, #EFE4C9 0%, #D4C59E 100%)',
        'dark-grain': 'radial-gradient(ellipse at top, #2A2218 0%, #120F0B 100%)',
      },
    },
  },
  plugins: [],
};
