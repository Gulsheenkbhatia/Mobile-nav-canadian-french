export default {
  parts: ['comparablePriceWrapper', 'comparablePrice'],
  baseStyle: ({ theme }) => ({
    comparablePriceWrapper: () => ({
      my: theme.space.s,
      color: theme.colors.neutral.dark,
      fontFamily: theme.fontFamily.secondaryNormal,
      lineHeight: theme.lineHeights.xl,
      fontWeight: 'normal',
    }),
    comparablePrice: {
      px: theme.space.s,
    },
  }),
}
