/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ers: {
          bg: 'var(--ers-bg)',
          surface: 'var(--ers-surface)',
          ink: 'var(--ers-ink)',
          'ink-soft': 'var(--ers-ink-soft)',
          line: 'var(--ers-line)',
          primary: 'var(--ers-primary)',
          'primary-ink': 'var(--ers-primary-ink)',
          accent: 'var(--ers-accent)',
          danger: 'var(--ers-danger)',
          warning: 'var(--ers-warning)',
        },
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable"', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['0.8125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
}