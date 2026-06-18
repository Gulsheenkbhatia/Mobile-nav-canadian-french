export default {
  baseStyle: ({ theme }) => ({
    shoppingGivesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'none',
      },
    },
  }),
}
