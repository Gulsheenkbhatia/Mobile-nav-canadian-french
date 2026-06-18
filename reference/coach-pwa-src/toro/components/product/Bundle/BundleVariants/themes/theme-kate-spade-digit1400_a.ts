export default {
  parts: ['atbControlsWrapper'],
  baseStyle: ({ theme }) => ({
    BundleVariantSwatchesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: '7px',
        mb: '0',
        '& .bundle-color-swatch-btn:first-child': {
          ml: '0',
        },
      },
    },
    BundleVariantSwatchesImage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '18px',
        h: '18px',
      },
    },
    BundleVariantSwatches: (selected) => ({
      mb: 0,
      maxWidth: '80px',
      borderRadius: theme.borderRadius.rounded,
      border: `${theme.borderWidth.default} solid`,
      borderColor: theme.colors.black,
      padding: selected ? '1px' : 0,
      boxSizing: 'content-box',
    }),
    bundleVariantImageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        maxHeight: 'unset',
        flex: '0 0 142px',
        w: '142px',
        h: '177px',
        m: 'unset',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    bundleVariantImage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '100%',
      },
    },
    bundleVariantCard: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        border: 'none',
        m: 0,
        py: 'var(--spacing-6)',
        '& .product-info-message': {
          mt: '18px',
          mb: '18px',
          p: '11.5px var(--spacing-3)',
          borderRadius: 'var(--border-radius-s)',
          background: '#F7F7F7', // missed from design tokens
        },
        '& .product-info-message-alert': {
          mb: '18px',
        },
      },
    },
    bundleTopInfo: {
      mb: '23px',
      '&:has(~ .product-variation-message-error-container:not(:empty))': {
        mb: '18px',
      },
    },
    bundlePriceContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
      },
    },
    bundleHeadline: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        fontStyle: 'normal',
        color: 'var(--color-black-base)',
        '+ .individual-bundle-product': {
          pt: '14.5px',
        },
      },
    }),
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      atbControlsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            mr: 'var(--spacing-2)',
            mt: '0',
          },
        },
      },
    }),
  },
}
