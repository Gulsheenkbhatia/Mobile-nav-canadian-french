export default {
  parts: ['whishlistButtonContainer'],
  baseStyle: ({ theme }) => ({
    whishlistButtonContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        position: 'static',
      },
    }),
  }),
}
