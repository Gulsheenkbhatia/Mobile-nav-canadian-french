export default {
  parts: ['addToBagButtonWrapper'],
  baseStyle: ({ theme }) => ({
    drawerSelectoptionWrapper: {
      button: {
        p: 0,
      },
      pb: 'var(--spacing-2)',
    },
    drawerSelectoptionWrapperText: {
      ...theme.typography['text-cta1-s'],
    },
    stickyPrice: {
      alignItems: 'center',
      gap: 'var(--spacing-2)',
    },
    productDetailsWrapper: {
      pr: '0px',
    },
    stickyAddToCartPriceContainer: {
      mr: '22.5px',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'center',
        mr: '0',
      },
    },
    LazyRatingsAndReviews: (isDesktop) => ({
      margin: isDesktop ? '0px 116px var(--spacing-10)' : '0px var(--text-12) var(--text-20)',
    }),
    mobileMainContainer: {
      pt: 'var(--spacing-2)',
    },
    addToBagCTA: (isBundleProduct) => ({
      mt: isBundleProduct ? 'var(--spacing-4)' : '0px',
    }),
    pdpMainContainerWrapper: {
      '.pdp-carousel-d': {
        background: 'var(--color-product-image-bg)',
      },
      '&.pdpv5_1': {
        display: 'block',
        backgroundColor: 'var(--color-neutral-light-1)',
        '& .pdp-carousel-d': {
          background: 'var(--color-neutral-light-1)',
        },
        '& .zoomModal': {
          backgroundColor: 'var(--color-neutral-light-1)',
        },
      },
    },
    addToBagWithSmallerText: {
      '& .applePayContainer': {
        marginTop: 0,
      },
    },
  }),
  variants: {
    quickview: ({ theme }) => ({
      pdpRedirectLink: {
        ...theme.typography['text-body1-m'],
        fontWeight: '400',
      },
      quantitySelector: {
        ...theme.typography['text-body1-l'],
        color: 'var(--color-neutral-base)',
      },
      pdpMainContainerWrapper: {
        '.pdp-carousel-d': {
          background: 'var(--color-white-base)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagButtonWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
        },
      },
    }),
  },
}
