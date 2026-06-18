export default {
  parts: ['productHeaderTitle'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-24)',
        lineHeight: 'var(--line-height-s)',
        letterSpacing: 'var(--letter-spacing-m)',
        color: 'var(--color-primary)',
        fontWeight: 400,
        mb: 0,
      },
    }),
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-20)',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-m)',
          color: 'var(--color-primary)',
          fontWeight: 400,
        },
      }),
    }),
  },
}
