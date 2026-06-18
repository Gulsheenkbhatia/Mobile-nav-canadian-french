export default {
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-26)',
      fontWeight: 700,
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-24)',
        fontWeight: 400,
      },
    },
    baseRecommendationMobileWrapper: {
      '& .recommendation-tile-name-wrapper > p': {
        fontFamily: 'var(--font-face1-normal)',
      },
      '& .tile-price-text': {
        fontFamily: 'var(--font-face1-normal)',
      },
    },
  }),
}
