export default {
  baseStyle: ({ theme }) => ({
    LazyRatingsAndReviews: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        padding: '1px var(--spacing-3) 28px', // missing in the design token
        backgroundColor: '#f7f7f7', // missing in the design token
        minHeight: 'auto !important',
        '&:before': {
          display: 'none',
        },
      },
    }),
    mobileMainContainer: {
      pb: 0,
    },
    productDetailsContainer: {
      mb: 'var(--spacing-3)',
      py: 0,
    },
    productDetailsWrapper: {
      mb: 0,
    },
    additionalDetailsContainer: {
      '& > .occasion-module:first-child, & > .product-details:first-child': {
        mt: 'var(--spacing-3)',
      },
      '& .product-details + #recommendations-section .certona_wrapper': {
        pt: 'var(--spacing-4)',
      },
    },
    contentAreaContainer: {
      '.content-divider::before': {
        display: 'none',
      },
    },
    customizedContainer: {
      '&:not(:has(.klarna-container, .findInStoreWrapper))': {
        '.addToBagCTAWrapper': {
          marginBottom: 'var(--spacing-6)',
        },
      },
    },
  }),
}
