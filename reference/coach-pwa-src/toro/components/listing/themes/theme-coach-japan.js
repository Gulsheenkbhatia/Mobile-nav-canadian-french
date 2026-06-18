export default {
  parts: ['totalProductsCount'],
  baseStyle: ({ theme }) => ({
    totalProductsCount: {
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.xxl,
      letterSpacing: theme.letterSpacings.md,
      fontWeight: 500,
    },
  }),
  variants: {
    plpV3: () => ({
      totalProductsCount: {
        fontSize: 'var(--text-12)',
      },
    }),
  },
}
