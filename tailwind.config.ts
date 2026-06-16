import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'serif'],
      },
      colors: {
        // Dark-luxo cinematográfico
        ink: '#070708', // preto profundo (fundo)
        carbon: '#0e0e11', // superfície elevada
        smoke: '#16161b', // cards / painéis
        champagne: '#d8b27c', // acento metálico quente
        platinum: '#e8e6e1', // off-white de texto
        accent: '#d8b27c', // alias p/ compat
        gold: '#d8b27c', // alias p/ compat
      },
      letterSpacing: {
        ultra: '0.4em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
