export default {
  parts: [
    'discountinuedProductWrapper',
    'productContentWrapper',
    'productIconErrorWrapper',
    'productErrDescription',
  ],
  baseStyle: ({ theme }) => ({
    discountinuedProductWrapper: {
      mt: theme.space.lm,
      mb: theme.space.discontinuedMb,
    },
    productContentWrapper: {
      p: theme.space.mar,
      bg: theme.colors.neutral.light,
    },
    productIconErrorWrapper: {
      mr: theme.space.mar,
    },
    productErrDescription: {
      lineHeight: theme.lineHeights.xl,
      fontWeight: 'normal',
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.primaryNormal,
    },
  }),
}
