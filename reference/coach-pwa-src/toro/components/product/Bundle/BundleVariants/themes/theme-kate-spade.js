export default {
  parts: ['bundleHeadline'],
  baseStyle: ({ theme }) => ({
    bundleHeadline: () => ({
      fontWeight: 'var(--chakra-fontWeights-normal)',
      ...theme.typography['text-display1-s'],
      pt: 'var(--spacing-3)',
      pb: 'var(--spacing-1)',
    }),
    bundleVariantImageContainer: {
      width: '80px',
      maxHeight: '100px',
      flexShrink: 0,
      mb: { base: 'var(--spacing-4)', lg: '0px' },
    },
    bundleVariantImage: {
      height: '100%',
    },
    bundleVariantCard: {
      mt: 'var(--spacing-3)',
    },
    BundleVariantSwatchesContainer: {
      mb: 'var(--spacing-6)',
    },
  }),
}
