export default {
  baseStyle: ({ theme }) => ({
    rVAndBecauseYouViewedContainer: {
      display: 'flex',
      overflowX: 'scroll',
      '& .recommendation-tile-price-wrapper .price-text': {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
    },
    recentlyViewedWrapper: {
      width: '100%',
    },
    containerTitleScrollable: {
      '& #rv_container': {
        padding: '29px 0 20px',
        '& .rv-title': {
          ...theme.typography['text-display4-xxs'],
          fontWeight: 700,
          paddingX: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-4)',
        },
        '& .rvImpressionSensor': {
          marginRight: 'var(--spacing-2)',
          '&:last-child': {
            marginRight: '4px',
          },
        },
        width: 'max-content',
        '& #rv_carousel': {
          overflow: 'unset',
          paddingX: 'var(--spacing-3)',
        },
      },
    },
    containerTitleNonScrollable: {
      '& #rv_container': {
        padding: '29px 0 0',
        '& .rv-title': {
          ...theme.typography['text-display4-xxs'],
          fontWeight: 700,
          paddingX: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-4)',
        },
        '& .rvImpressionSensor': {
          marginRight: 'var(--spacing-2)',
          '&:last-child': {
            marginRight: '4px',
          },
        },
        width: '100%',
        '& #rv_carousel': {
          paddingBottom: '20px',
          paddingX: 'var(--spacing-3)',
        },
      },
    },
    recommendationsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-1)',
      '&:has(#rv_collapsible_container):has(#byv_collapsible_container)': {
        '& #rv_collapsible_container': {
          mb: 0,
        },
        '& #byv_collapsible_container': {
          mt: 0,
        },
      },
    },
  }),
}
