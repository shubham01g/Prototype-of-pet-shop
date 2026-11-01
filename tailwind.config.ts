import type { Config } from 'tailwindcss'

const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [{ pattern: /^(bg|text|ring|border)-(brand|coral|sun|berry|sky|sage|plum)(-soft)?$/ }],
  theme: {
    extend: {
      colors: {
        canvas: v('canvas'),
        surface: v('surface'),
        muted: v('muted'),
        line: v('line'),
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), 3: v('ink-3') },
        brand: { DEFAULT: v('brand'), strong: v('brand-strong'), soft: v('brand-soft'), fg: v('brand-fg') },
        coral: { DEFAULT: v('coral'), soft: v('coral-soft') },
        sun: { DEFAULT: v('sun'), soft: v('sun-soft') },
        berry: { DEFAULT: v('berry'), soft: v('berry-soft') },
        sky: { DEFAULT: v('sky'), soft: v('sky-soft') },
        sage: { DEFAULT: v('sage'), soft: v('sage-soft') },
        plum: { DEFAULT: v('plum'), soft: v('plum-soft') },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(16 32 28 / 0.04), 0 4px 16px -4px rgb(16 32 28 / 0.08)',
        lift: '0 2px 4px rgb(16 32 28 / 0.04), 0 12px 32px -8px rgb(16 32 28 / 0.16)',
        float: '0 24px 64px -16px rgb(16 32 28 / 0.28), 0 4px 12px rgb(16 32 28 / 0.06)',
        glow: '0 0 0 4px rgb(var(--c-brand) / 0.12)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity: '0.6' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.2,0.6,0.3,1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
