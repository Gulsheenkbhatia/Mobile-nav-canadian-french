export default {
  parts: ['productHeaderTitle'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: ({ isNewMegaPDPTurnOn }) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        lineHeight: 'var(--line-height-s)',
        letterSpacing: 'var(--letter-spacing-s)',
        marginTop: isNewMegaPDPTurnOn ? '18px' : 'var(--spacing-3)',
        marginBottom: '0px',
      },
    }),
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-16)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-s)',
          mb: 0,
          mt: '-3px',
        },
      }),
    }),
  },
}
