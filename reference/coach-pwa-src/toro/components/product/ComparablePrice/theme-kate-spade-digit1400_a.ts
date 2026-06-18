export default {
  baseStyle: ({ theme }) => ({
    comparablePriceContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 'var(--spacing-2)',
      },
    }),
    comparablePriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontWeight: 500,
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-m)',
      },
    }),
    comparablePrice: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        pl: 'var(--spacing-1)',
      },
    },
    comparablePriceValue: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontWeight: 500,
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-m)',
      },
    }),
  }),
}
