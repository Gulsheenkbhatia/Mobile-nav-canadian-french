export default {
  parts: ['productHeaderTitle'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-120)',
        fontWeight: 700,
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-primary)',
      },
    }),
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-bold)',
          fontSize: 'var(--text-16)',
          lineHeight: 'var(--line-height-120)',
          fontWeight: 700,
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-primary)',
        },
      }),
    }),
  },
}
