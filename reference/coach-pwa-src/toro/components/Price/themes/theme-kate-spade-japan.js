export default {
  parts: ['strikethroughListPriceText', 'discPercent', 'prices'],
  variants: {
    searchSuggestions: () => ({
      prices: {
        fontSize: 'var(--text-12)',
      },
      strikethroughListPriceText: {
        fontSize: 'var(--text-12)',
        color: 'var(--color-neutral-base)',
      },
      discPercent: () => ({
        fontSize: 'var(--text-12)',
        ml: 'var(--spacing-1)',
        mr: 'var(--spacing-1)',
      }),
    }),
    plpV3: ({ theme }) => ({
      prices: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.priceRange': {
            color: 'var(--color-black-base)',
          },
        },
      },
      strikethroughListPriceText: {
        marginTop: '0px',
        color: 'var(--color-neutral-medium)',
      },
      discPercent: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-neutral-medium)',
        ml: 'var(--spacing-1)',
        mr: 'var(--spacing-1)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          color: 'var(--color-neutral-medium)',
        },
      }),
    }),
  },
}
