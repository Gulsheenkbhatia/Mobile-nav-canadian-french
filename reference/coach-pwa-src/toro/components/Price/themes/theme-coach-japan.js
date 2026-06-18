export default {
  parts: ['discPercent', 'prices', 'sameRangePrice', 'mainPrice'],
  baseStyle: ({ theme }) => ({
    discPercent: () => ({
      ml: 'var(--spacing-2)',
      ...theme.typography['text-body2-s'],
    }),
    prices: {
      ...theme.typography['text-display1-xs'],
    },
    sameRangePrice: {
      ...theme.typography['text-display1-xs'],
      color: theme.colors.main.gray,
    },
    mainPrice: ({ toDisplayMarkdownPrice }) => ({
      color: toDisplayMarkdownPrice ? theme.colors.main.saleRed : theme.colors.main.gray,
    }),
  }),
  variants: {
    searchSuggestions: () => ({
      prices: {
        fontSize: 'var(--text-12)',
      },
    }),
    plpV3: () => ({
      strikethroughListPriceText: {
        marginTop: '0px',
      },
    }),
  },
}
