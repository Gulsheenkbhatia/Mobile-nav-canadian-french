/**
 * PDP v6 mobile — Coach Japan. Cascades into recommendation tiles via
 * `baseRecommendationMobileWrapper` (class `recommendation-tile-name-wrapper` lives on the tile).
 */
export default {
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display4-s'],
      },
    },
    baseRecommendationMobileWrapper: {
      maxWidth: '100%',
      '& .recommendation-tile-name-wrapper': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textAlign: 'center',
        },
      },
      '& .recommendation-tile-name-wrapper > p': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xxs'],
        },
      },
      '& .tile-price-text': {
        ...theme.typography['text-display4-xxs'],
        fontSize: 'var(--text-14)',
      },
    },
  }),
}
