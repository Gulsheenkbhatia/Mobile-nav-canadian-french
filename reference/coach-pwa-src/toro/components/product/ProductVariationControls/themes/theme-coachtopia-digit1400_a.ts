export default {
  parts: ['btnChild'],
  baseStyle: ({ theme }) => ({
    productImagesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minHeight: 'auto',
      },
    },
  }),
}
