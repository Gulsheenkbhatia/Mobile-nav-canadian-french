export default {
  parts: ['atbWrapper'],
  baseStyle: ({ theme }) => ({
    AddToBagCTAWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '18px' /* This value does not exist in design-tokens */,
        '& .biz-inventory-status': {
          padding: 0,
          fontFamily: 'var(--font-face-1-normal)',
          fontWeight: 400,
          color: 'var(--color-black-base)',
          fontSize: 'var(--text-12)',
        },
        '& .product-info-message-alert, & .product-info-message': {
          borderRadius: 'var(--border-radius-s)',
          mt: '3px',
          mb: 'var(--spacing-1)',
        },
      },
    },
    buyNowWrapper: {
      '& button.buy-now-button': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          height: '57px',
          marginTop: 'var(--spacing-2)',
          fontSize: 'var(--text-12)',
        },
      },
    },
    NotifyMeWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .product-info-message-alert, & .product-info-message': {
          borderRadius: 'var(--border-radius-s)',
          mt: '3px',
          mb: 'var(--spacing-1)',
        },
        '.notify-me': {
          height: '57px',
          mt: 'var(--spacing-2)',
        },
      },
    },
    mobileHeroContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 'var(--spacing-4)',
      },
    }),
    ReviewAndRating: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minHeight: 'auto',
      },
    }),
    BottomProductVariationControls: {
      mb: 'var(--spacing-3)',
      '&:empty': {
        mb: 0,
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ':has(.controls-btn-wrapper-grid-large):not(:has(.color-variants))': {
          ':has(:last-child.size-guide-container)': {
            marginBottom: '9px',
          },
          ':has(:last-child.controls-btn-wrapper-grid-large)': {
            marginBottom: 'var(--spacing-2)',
          },
        },
        ':has(.color-variants)': {
          marginBottom: '16px',
        },
      },
    },
    customizedContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '&:has(.klarna-container) .customization_cta': {
          mt: 'var(--spacing-2)',
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
        gap: 'var(--spacing-3) 6px',
        alignItems: 'center',
        height: 'auto',
        lineHeight: 'auto',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      buyNowWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& button.buy-now-button': {
            paddingTop: '15px',
          },
        },
      },
    }),
  },
}
