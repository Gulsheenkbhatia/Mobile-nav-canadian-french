export default {
  baseStyle: ({ theme }) => ({
    baseRecommendationWrapper: {
      '&&': {
        pt: 'var(--spacing-10)',
        pb: 'var(--spacing-6)',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
    },
    baseRecommendationTitle: {
      textTransform: 'capitalize',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-24)',
      },
    },
    baseRecommendationMobileItems: {
      mt: 'var(--spacing-3)',
      gridGap: 'var(--spacing-3)',
    },
    baseRecommendationContentDivider: {
      '&.content-divider::before': {
        display: 'none',
      },
    },
  }),
}
