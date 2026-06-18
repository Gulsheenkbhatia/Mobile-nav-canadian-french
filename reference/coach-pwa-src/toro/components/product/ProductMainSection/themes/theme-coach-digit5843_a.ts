export default {
  baseStyle: ({ theme }) => ({
    LazyRatingsAndReviews: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        padding: '0px var(--spacing-3)',
        backgroundColor: 'var(--color-neutral-light)',
        minHeight: '204px !important',
        '&:before': {
          display: 'none',
        },
      },
    }),
    productDetailsContainer: {
      pt: 0,
    },
    mobileMainContainer: {
      pb: 0,
    },
    productDetailsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingRight: 0,
        '& .chakra-accordion__item': {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
    },
    contentAreaContainer: {
      '.content-divider::before': {
        display: 'none',
      },
      '& .custom-content-area-container': {
        minHeight: 'auto !important', // need to rewrite inline style
      },
      '& .content-areaOne': {
        pt: '0 !important',
      },
      '& .content-areaTwo': {
        pt: '0 !important',
      },
      '& .content-areaThree': {
        pt: '0 !important',
      },
    },
    additionalDetailsContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& #recommendations-section': {
          '.content-divider::before': {
            display: 'none',
          },
        },
        '& .product-details + #recommendations-section .certona_wrapper': {
          pt: 'var(--spacing-4)',
        },
        '& .product-details + div > #recommendations-section .einstein_wrapper': {
          pt: '20px',
        },
      },
    },
  }),
}
