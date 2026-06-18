export default {
  parts: ['ProductTitle', 'ProductInfoStyle'],
  baseStyle: ({ theme }) => ({
    findAStoreButton: {
      ...theme.typography['text-cta1-m'],
    },
  }),
}
