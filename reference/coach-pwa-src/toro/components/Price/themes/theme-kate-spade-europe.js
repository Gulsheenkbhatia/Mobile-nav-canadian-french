export default {
  variants: {
    plpV3: ({ theme }) => ({
      discPercent: () => ({
        color: 'var(--color-neutral-medium)',
        ml: 'var(--spacing-1)',
        mr: 'var(--spacing-1)',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          marginRight: 'var(--spacing-0, 0px)',
        },
      }),
      renderSalePriceWrapper: {
        '.hasDiscount': { color: 'var(--color-error-primary, #D50032)' },
      },
      prices: {
        '&.priceRange': {
          color: 'var(--color-error-primary, #D50032)',
        },
      },
    }),
  },
}
