export default {
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-24)',
      },
      fontFamily: 'var(--font-face1-bold)',
    },
  }),
  variants: {
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-bold)',
        },
      },
    }),
  },
}
