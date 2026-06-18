export default {
  baseStyle: ({ theme }) => ({
    LazyRatingsAndReviews: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        padding: '0px var(--spacing-3)',
        backgroundColor: 'var(--color-neutral-light)',
        minHeight: '203px !important',
        '&:before': {
          display: 'none',
        },
      },
    }),
    additionalDetailsContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '#closerlook-section': {
          background: 'transparent',
        },
        '& #recommendations-section': {
          '.content-divider::before': {
            display: 'none',
          },
        },
        '& .product-details + #recommendations-section .certona_wrapper': {
          pt: 'var(--spacing-4)',
        },
        '& .product-details + div > #recommendations-section .einstein_wrapper': {
          pt: '14px',
        },
      },
    },
    productDetailsContainer: {
      py: 0,
      mb: '20px',
    },
    productDetailsWrapper: {
      paddingRight: 0,
      marginBottom: 0,
      '& #product-info': {
        marginTop: 0,
      },
      '& .chakra-accordion__item': {
        borderColor: 'rgba(36, 34, 34, 0.20)', // missing in the design token
      },
    },
    mobileMainContainer: {
      pb: 0,
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
  }),
}
