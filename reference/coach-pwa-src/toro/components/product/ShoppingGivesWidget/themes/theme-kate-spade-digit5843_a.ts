export default {
  baseStyle: ({ theme }) => ({
    shoppingGivesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 0,
        padding: 0,
      },
    },
  }),
}
