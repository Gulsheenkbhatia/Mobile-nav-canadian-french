export default {
  baseStyle: ({ theme }) => ({
    bundleVariantCard: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '&:last-of-type': {
          marginBottom: '20px',
        },
      },
    },
  }),
}
