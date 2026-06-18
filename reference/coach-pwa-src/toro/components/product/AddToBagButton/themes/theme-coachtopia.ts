export default {
  parts: ['addToBagButton'],
  baseStyle: ({ theme }) => ({
    addToBagButton: () => ({
      ...theme.typography['text-cta1-m'],
    }),
  }),
}
