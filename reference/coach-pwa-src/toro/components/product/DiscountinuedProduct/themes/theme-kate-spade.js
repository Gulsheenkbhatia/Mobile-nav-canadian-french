export default {
  baseStyle: ({ theme }) => ({
    productContentWrapper: {
      bg: 'var(--color-cream)',
    },
    productErrDescription: {
      ...theme.typography['text-body1-m'],
    },
    discountinuedProductWrapper: {
      mb: theme.space.l,
      mt: theme.space.l,
    },
  }),
}
