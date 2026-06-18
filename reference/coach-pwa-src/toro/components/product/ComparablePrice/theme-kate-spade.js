export default {
  parts: ['comparablePriceText', 'comparablePriceValue'],
  baseStyle: ({ theme }) => ({
    comparablePriceWrapper: () => ({
      mb: 0,
    }),
    comparablePriceText: () => ({
      color: 'var(--color-neutral-dark)',
      ...theme.typography['text-body2-s'],
    }),
    comparablePriceValue: () => ({
      color: 'var(--color-neutral-dark)',
      ...theme.typography['text-body2-s'],
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      comparablePriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          color: '#696969',
        },
      }),
      comparablePriceValue: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          color: '#696969',
        },
      }),
    }),
  },
}
