export default {
  baseStyle: ({ theme }) => ({
    stickyAddToCartPriceContainer: {
      mr: '23.5px',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mr: '0',
      },
    },
  }),
}
