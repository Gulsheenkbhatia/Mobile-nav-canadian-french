export default {
  baseStyle: ({ theme }) => ({
    discPercent: () => ({
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.gray,
    }),
    prices: {
      ...theme.typography['text-body1-s'],
    },
    sameRangePrice: {
      ...theme.typography['text-body1-s'],
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      strikethroughListPriceText: {
        marginTop: '0px',
      },
      prices: {
        ...theme.typography['text-body1-s'],
      },
    }),
  },
}
