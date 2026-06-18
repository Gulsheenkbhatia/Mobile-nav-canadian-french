export default {
  parts: ['atbControlsWrapper'],
  baseStyle: ({ theme }) => ({
    bundleVariantCard: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderTop: 'none',
        m: '0 0 var(--spacing-8) 0',
        p: '0',
      },
    },
    bundleVariantImageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        maxHeight: 'unset',
        minWidth: '142px',
        h: '188px',
        m: 'unset',
      },
    },
    bundleProductInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '100%',
        overflow: 'hidden',
      },
    },
    bundlePriceContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        flexDirection: 'column',
        m: 'var(--spacing-2) 0 var(--spacing-3)',
        justifyContent: 'flex-start',
      },
    },
    BundleVariantSwatchesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 'unset',
      },
    },
    bundleHeadline: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 'var(--spacing-6)',
      },
    }),
    BundleVariantSwatchesImage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '18px',
        h: '18px',
      },
    },
    BundleVariantSwatches: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        p: '1px',
        mb: 0,
        ml: 0,
        '& img': {
          w: '18px',
          h: '18px',
        },
      },
    }),
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      atbControlsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            height: '40px',
            mt: '18px',
          },
          '.chakra-select': {
            height: '40px',
            minHeight: 'auto',
          },
        },
      },
    }),
  },
}
