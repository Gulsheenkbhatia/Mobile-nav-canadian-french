export default {
  baseStyle: ({ theme }) => ({
    addToBagWrapper: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: 0,
      },
    },
    sizeDrawerBtn: {
      textTransform: 'uppercase',
    },
  }),
}
