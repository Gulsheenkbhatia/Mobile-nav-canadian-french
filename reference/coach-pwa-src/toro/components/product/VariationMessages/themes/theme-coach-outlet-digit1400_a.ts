export default {
  baseStyle: ({ theme }) => ({
    ErrorMessageContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 0,
        mb: 0,
        '&:empty': {
          m: 0,
        },
        '& .product-info-message': {
          mt: 'var(--spacing-6)',
        },
      },
    }),
  }),
}
