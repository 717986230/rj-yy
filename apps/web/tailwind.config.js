/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        deep: 'rgb(var(--c-deep) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        mute: 'rgb(var(--c-mute) / <alpha-value>)',
        aqua: 'rgb(var(--c-aqua) / <alpha-value>)',
        'aqua-ink': 'rgb(var(--c-aqua-ink) / <alpha-value>)',
        fur: 'rgb(var(--c-fur) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        coral: 'rgb(var(--c-coral) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fredoka', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
      },
      boxShadow: {
        soft: '0 18px 40px -18px rgb(0 0 0 / 0.65), 0 2px 6px rgb(0 0 0 / 0.25)',
        glow: '0 0 0 1px rgb(var(--c-aqua) / 0.25), 0 10px 30px -10px rgb(var(--c-aqua) / 0.45)',
      },
    },
  },
  plugins: [],
};
