export default {
  baseStyle: ({ theme }) => ({
    reviewCount: () => ({
      ...theme.typography['text-body2-s'],
      color: theme.colors.main.black,
    }),
  }),
}
