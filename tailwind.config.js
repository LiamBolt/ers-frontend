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
          bg: 'rgb(var(--ers-bg-rgb) / <alpha-value>)',
          surface: 'rgb(var(--ers-surface-rgb) / <alpha-value>)',
          ink: 'rgb(var(--ers-ink-rgb) / <alpha-value>)',
          'ink-soft': 'rgb(var(--ers-ink-soft-rgb) / <alpha-value>)',
          muted: 'rgb(var(--ers-muted-rgb) / <alpha-value>)',
          line: 'rgb(var(--ers-line-rgb) / <alpha-value>)',
          primary: 'rgb(var(--ers-primary-rgb) / <alpha-value>)',
          'primary-hover': 'rgb(var(--ers-primary-hover-rgb) / <alpha-value>)',
          'primary-ink': 'rgb(var(--ers-primary-ink-rgb) / <alpha-value>)',
          accent: 'rgb(var(--ers-accent-rgb) / <alpha-value>)',
          danger: 'rgb(var(--ers-danger-rgb) / <alpha-value>)',
          warning: 'rgb(var(--ers-warning-rgb) / <alpha-value>)',
          sidebar: 'rgb(var(--ers-sidebar-rgb) / <alpha-value>)',
          'sidebar-fg': 'rgb(var(--ers-sidebar-fg-rgb) / <alpha-value>)',
          scrim: 'rgb(var(--ers-scrim-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Neutral, offset + soft blur. No coloured halos.
        card: '0 1px 2px rgb(23 21 28 / 0.04), 0 1px 3px rgb(23 21 28 / 0.06)',
        pop: '0 12px 32px rgb(23 21 28 / 0.14), 0 2px 6px rgb(23 21 28 / 0.06)',
      },
      fontSize: {
        'stat': ['1.875rem', { lineHeight: '1.1', fontWeight: '700' }],
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