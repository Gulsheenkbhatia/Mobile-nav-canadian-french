export default {
  baseStyle: ({ theme }) => ({
    priceWrapper: {
      marginTop: 0,
    },
    comparablePrice: {
      marginTop: 'var(--spacing-1)',
    },
    price: {
      ...theme.typography['text-body1-m'],
    },
  }),
}
