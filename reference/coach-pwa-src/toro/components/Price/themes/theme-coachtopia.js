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
}
