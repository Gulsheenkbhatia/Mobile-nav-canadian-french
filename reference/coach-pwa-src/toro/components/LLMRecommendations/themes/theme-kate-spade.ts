export default {
  parts: [
    'mobileRecommendationItems',
    'wrapper',
    'title',
    'price',
    'mobileRecommendationGrid',
    'recommendationGridWrapper',
    'recommendedPriceMainWrapper',
    'productName',
  ],
  baseStyle: ({ theme }) => ({
    wrapper: {
      pb: 'var(--spacing-8)',
    },
    price: {
      fontFamily: 'var(--font-face1-medium)',
      fontSize: 'var(--text-14)',
    },
    title: {
      ...theme.typography['text-display1-m'],
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-28)', // missing text-display1-ms
      textAlign: 'left',
      paddingRight: theme.space.mar,
      letterSpacing: '0.2px',
    },
  }),
  variants: {
    aeDrawerGrid: ({ theme }) => ({
      title: {
        ...theme.typography['text-display1-s'],
        pb: 'var(--spacing-4)',
        pr: 0,
      },
      recommendationGridWrapper: {
        pt: 'var(--spacing-4)',
      },
      mobileRecommendationGrid: {
        rowGap: 'var(--spacing-4)',
      },
    }),
    aeDrawerGridSocial: ({ theme }) => ({
      title: {
        ...theme.typography['text-body1-m'],
        pb: 'var(--spacing-4)',
        pr: 0,
      },
      recommendationGridWrapper: {
        py: 'var(--spacing-6)',
        px: '20px',
      },

      mobileRecommendationGrid: {
        columnGap: 's1',
        rowGap: '9px',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gap: 'var(--spacing-4)',
        },
      },

      productName: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        minWidth: 0,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
        },
      },

      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            marginTop: 0,
            padding: 0,
          },
        },
        '& .recommendation-tile-price-wrapper': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body2-s'],
            alignItems: 'baseline',
            justifyContent: 'start',
            '.price-text': {
              color: 'var(--color-black-base)',
              fontSize: 'var(--text-14)',
            },
          },
        },
        '& .recommendation-price-comparable': {
          justifyContent: 'start',
        },
      },
    }),
  },
}
