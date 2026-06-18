export default {
  parts: [
    'enhancedRecommendationWrapper',
    'recommendationWrapper',
    'certonaTitle',
    'recommendationGrid',
    'enhancedRecommendationLargeCell',
    'enhancedRecommendationSmallCell',
    'productLink',
    'productImage',
    'enhancedRecommendationCell',
  ],
  baseStyle: ({ theme }) => ({
    enhancedRecommendationWrapper: {
      minH: 'auto',
    },
    recommendationWrapper: {
      pt: 'var(--spacing-8)',
      pb: 'var(--spacing-10)',
      pl: '0',
      flexDirection: 'column',
    },
    certonaTitle: {
      ...theme.typography['text-display4-s'],
      fontFamily: 'var(--font-face1-extended-bold)',
      color: 'var(--color-primary)',
      textAlign: 'left',
      mb: 'var(--spacing-4)',
      pl: 'var(--spacing-3)',
    },
    recommendationGrid: {
      width: '100%',
      height: 'fit-content',
      overflowX: 'scroll',
      gap: 'var(--spacing-2) 0',
      gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
      gridAutoFlow: 'column',
      gridAutoColumns: 'max-content',
      display: 'grid',
    },
    enhancedRecommendationCell: {
      mx: 'var(--spacing-1)',
      flexDirection: 'column',
      display: 'flex',
      '&:nth-child(1)': {
        ml: 'var(--spacing-3)',
      },
      '&:nth-child(3n)': {
        alignSelf: 'end',
      },
    },
    enhancedRecommendationLargeCell: {
      gridRow: 'span 2 / span 2',
      maxWidth: '51vw',
      minWidth: '51vw',
      '& .recommendation-wrapper,& .recommendation-tile-wrapper': {
        height: '100%',
      },
      '.product-image': {
        width: '100%',
        aspectRatio: '2/3',
        height: '100%',
      },
      '.product-image img': {
        aspectRatio: '2/3',
        width: '100%',
      },
    },
    enhancedRecommendationSmallCell: {
      maxWidth: '36vw',
      minWidth: '36vw',
      '.product-image': {
        width: '100%',
        aspectRatio: '1/1',
      },
      '.product-image img': {
        aspectRatio: '1/1',
        width: '100%',
      },
    },
    productLink: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      '.product-image': {
        border: '1px solid var(--color-neutral-light-3)',
        borderRadius: 'var(--border-radius-m)',
        overflow: 'hidden',
        backgroundColor: '#F0F0F0', // missing design tokens
      },
    },
    recommendationImpressionSensor: {
      position: 'relative',
    },
    atbContainer: {
      position: 'absolute',
      right: '1px',
      top: '1px',
      padding: 0,
      zIndex: 1,
      overflow: 'hidden',
    },
    atbButtonText: {
      display: 'none',
    },
    atbButton: {
      padding: '6px 6px 7px 7px',
      borderRadius: '0px 9px 0px 12px',
      border: '0px',
      minWidth: '0px',
      height: 'auto',
      '& svg': {
        marginRight: '0px',
      },
      '&:disabled, &:disabled:hover': {
        background: 'var(--color-background-cta-disabled, #C5C5C5)',
        opacity: 1,
        '& svg': {
          fill: 'var(--color-black-base)',
        },
      },
    },
    atbIcon: {
      width: '18px',
      height: '18px',
    },
  }),
  variants: {
    deals: {
      recommendationWrapper: {
        pt: 'var(--spacing-6)',
      },
    },
  },
}
