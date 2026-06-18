export default {
  baseStyle: ({ theme }) => ({
    discountinuedProductWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: '20px',
      },
    },
  }),
}
