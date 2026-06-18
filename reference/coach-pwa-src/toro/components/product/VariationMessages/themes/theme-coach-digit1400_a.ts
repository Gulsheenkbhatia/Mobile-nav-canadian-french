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
          padding: 'var(--spacing-3)',
        },
      },
    }),
    customMessageWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-4) var(--spacing-3)!important',
      },
    },
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-black-base)',
      },
    },
    shipDate: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-black-base)',
      },
    },
  }),
}
