export default {
  parts: [
    'baseRecommendationWrapper',
    'baseRecommendationTitle',
    'baseRecommendationMobileItems',
    'baseRecommendationContentDivider',
  ],
  baseStyle: ({ theme }) => ({
    baseRecommendationWrapper: {
      '&&': {
        pt: 'var(--spacing-10)',
        pb: 'var(--spacing-6)',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
    },
    baseRecommendationTitle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display2-m'],
        textTransform: 'capitalize',
      },
    },
    baseRecommendationMobileItems: {
      maxWidth: '100vw',
      overflowX: 'scroll',
      gridGap: 'var(--spacing-3)',
      pr: 'var(--spacing-3)',
      pl: 'var(--spacing-3)',
      mt: 'var(--spacing-3)',
    },
    baseRecommendationContentDivider: {
      '&.content-divider::before': {
        display: 'none',
      },
    },
  }),
  variants: {
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-m'],
          textAlign: 'center',
        },
      },
    }),
  },
}
