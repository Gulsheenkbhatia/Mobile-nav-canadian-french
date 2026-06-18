export default {
  baseStyle: ({ theme }) => ({
    BundleVariantSwatchesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 'var(--spacing-3)',
        mb: 'var(--spacing-2)',
      },
    },
    BundleVariantSwatchesImage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '22px',
        h: '22px',
      },
    },
    BundleVariantSwatches: () => ({
      mb: 0,
    }),
    bundleVariantImageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        maxHeight: 'unset',
        flex: '0 0 142px',
        w: '142px',
        h: '188px',
        m: 'unset',
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
          mt: '10px',
          mb: 0,
        },
      },
    },
    bundleTopInfo: {
      mb: 'var(--spacing-1)',
    },
    bundlePriceContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
      },
    },
    bundleHeadline: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-l'],
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontWeight: 700,
        color: 'var(--color-primary)',
      },
    }),
  }),
}
