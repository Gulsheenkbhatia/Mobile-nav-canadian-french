export default {
  parts: ['whishlistButton'],
  baseStyle: ({ theme }) => ({
    whishlistButton: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        position: 'static',
      },
    }),
  }),
}
