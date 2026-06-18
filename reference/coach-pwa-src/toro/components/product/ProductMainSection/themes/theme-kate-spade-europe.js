export default {
  parts: ['NotifyMeWrapper', 'AddToBagCTAWrapper'],
  baseStyle: ({ theme }) => ({
    pdpMainContainerWrapper: {
      '.pdp-carousel-d': {
        backgroundColor: 'var(--color-product-image-bg)',
      },
    },
    stickyAddToCartPriceContainer: {
      mr: '23.5px',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mr: '0',
      },
    },
    stickyPrice: {
      bg: 'none',
      alignItems: 'center',
      gap: 'var(--spacing-2) 8px',
    },
  }),
  variants: {
    quickview: () => ({
      pdpMainContainerWrapper: {
        '.pdp-carousel-d': {
          backgroundColor: 'var(--color-white-base)',
        },
      },
    }),
    adaptiveTabbedPDP: () => ({
      AddToBagCTAWrapper: {
        '.atb-ctas-wrapper, .atb-wrapper, .add-to-cart, .atb-notify-wrapper, .notify-me': {
          height: '42px',
        },
      },
      NotifyMeWrapper: {
        height: '42px',
        '.notify-me': {
          height: '42px',
        },
      },
      addToBagCTAButtons: {
        height: '42px',
        '.main-selector': {
          height: '42px',
        },
        '.atb-wrapper': {
          height: '42px',
        },
      },
    }),
  },
}
