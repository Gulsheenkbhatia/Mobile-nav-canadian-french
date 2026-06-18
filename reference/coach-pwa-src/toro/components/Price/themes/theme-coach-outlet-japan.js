export default {
  parts: ['discPercent', 'prices', 'comparablePriceTheme', 'sameRangePrice'],
  baseStyle: ({ theme }) => ({
    discPercent: () => ({
      ...theme.typography['text-body2-s'],
      color: 'var(--color-sale)',
      ml: 'var(--spacing-2)',
    }),
    prices: {
      ...theme.typography['text-display2-xs'],
    },
    comparablePriceTheme: () => ({
      ...theme.typography['text-body2-s'],
    }),
    sameRangePrice: {
      ...theme.typography['text-display2-xs'],
    },
  }),
  variants: {
    searchSuggestions: () => ({
      prices: {
        fontSize: 'var(--text-12)',
      },
    }),
    plpV3: ({ theme }) => ({
      prices: {
        ...theme.typography['text-display2-xs'],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display2-xs'],
        },
      },
      discPercent: () => ({
        color: 'var(--color-sale)',
        ...theme.typography['text-body2-s'],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
        },
      }),
    }),
  },
}
