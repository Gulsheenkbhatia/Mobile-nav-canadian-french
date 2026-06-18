export default {
  baseStyle: ({ theme }) => ({
    productLink: {
      '.product-image': {
        backgroundColor: 'var(--color-product-image-bg)',
      },
    },
    recommendationWrapper: {
      pt: 'var(--spacing-6) !important', // override experiment controlled styles
      pb: 'var(--spacing-10) !important', // override experiment controlled styles
    },
    recommendationGrid: {
      overflowY: 'hidden',
    },
    certonaTitle: {
      ...theme.typography['text-display1-m'],
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-28)',
      fontWeight: '400',
      lineHeight: 'var(--line-height-s)',
      letterSpacing: 'var(--letter-spacing-s)',
    },
    enhancedRecommendationCell: {
      '& img': {
        objectFit: 'contain',
      },
    },
  }),
  variants: {
    deals: ({ theme }) => ({
      certonaTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-ms'],
          fontWeight: 500,
        },
      },
    }),
  },
}
