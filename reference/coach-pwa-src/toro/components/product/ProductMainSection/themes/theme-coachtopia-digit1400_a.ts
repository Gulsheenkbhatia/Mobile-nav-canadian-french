export default {
  parts: ['LazyRatingsAndReviews'],
  baseStyle: ({ theme }) => ({
    LazyRatingsAndReviews: (isDesktop) => ({
      margin: isDesktop ? '0 116px 40px' : '0 0 20px',
    }),
    buyNowButton: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-2)',
        height: 'auto',
      },
    },
    AddToBagCTAWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .product-info-message-alert': {
          mt: '10.5px',
          mb: 'var(--spacing-1)',
        },
      },
    },
    NotifyMeWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '.notify-me': {
          height: '57px',
          mt: 'var(--spacing-2)',
        },
      },
    },
    BottomProductVariationControls: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '&:empty': {
          mb: 0,
        },
        '.size-guide-container': {
          marginBottom: 'var(--spacing-1)',
        },
        ':has(.color-variants)': {
          marginBottom: '6px',
          '.color-variants': {
            marginBottom: '6px',
          },
        },
      },
    },
    stickyAddToCartPriceContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'center',
      },
    },
  }),
}
