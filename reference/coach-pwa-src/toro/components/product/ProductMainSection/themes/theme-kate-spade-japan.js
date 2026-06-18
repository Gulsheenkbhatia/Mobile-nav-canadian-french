export default {
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
    productDetailsWrapper: {
      pr: '0px',
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
    },
    stickyPrice: {
      alignItems: 'center',
      '& > div:last-child': {
        marginLeft: 'auto',
      },
    },
    stickyPriceWrapper: {
      flexWrap: 'nowrap',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexWrap: 'wrap',
      },
    },
    stickyAddToBagWrapper: {
      flexBasis: '100%',
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
          background: 'var(--color-product-image-bg)',
        },
      },
    }),
  },
}
