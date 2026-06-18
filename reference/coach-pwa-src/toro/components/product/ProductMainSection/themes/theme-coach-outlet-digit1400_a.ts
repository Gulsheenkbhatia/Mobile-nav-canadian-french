export default {
  baseStyle: ({ theme }) => ({
    AddToBagCTAWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '18px' /* This value does not exist in design-tokens */,
        '.product-info-message-alert': {
          marginBottom: '4px',
        },
      },
    },
    buyNowWrapper: {
      '& button.buy-now-button': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: 'var(--spacing-2)',
          height: '57px',
          fontSize: 'var(--text-12)',
        },
      },
    },
    ReviewAndRating: () => ({
      minHeight: '13px',
    }),
    mobileHeroContainer: () => ({
      mb: 0,
    }),
    drawerSelectoptionWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderBottom: 'none',
        justifyContent: 'flex-end',
        pb: 0,
        mb: '6px',
      },
    },
    drawerWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderBottom: 'none',
        '& .product-size-controls': {
          mb: 0,
        },
        '& .size-guide-container': {
          mb: 'var(--spacing-4)',
        },
      },
    },
    BottomProductVariationControls: {
      mb: 'var(--spacing-3)',
      '&:empty': {
        mb: 0,
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '&:empty+.product-attribute-wrapper': {
          marginTop: '9.5px',
        },
        ':has(.controls-btn-wrapper-grid-large):not(:has(.color-variants))': {
          ':has(:last-child.size-guide-container)': {
            marginBottom: 'var(--spacing-2)',
          },
          ':has(:last-child.controls-btn-wrapper-grid-large)': {
            marginBottom: 'var(--spacing-2)',
          },
        },
      },
    },
    stickyAddToCartPriceContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'center',
      },
    },
    stickyPrice: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        gap: '6px',
        alignItems: 'center',
        height: 'auto',
        mt: 0,
      },
    },
  }),
}
