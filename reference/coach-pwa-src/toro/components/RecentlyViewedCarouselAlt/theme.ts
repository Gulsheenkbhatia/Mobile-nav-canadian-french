export default {
  baseStyle: ({ theme }) => ({
    rvWrapper: {
      padding: 'var(--spacing-2) var(--spacing-3)',
      backgroundColor: '#f0f0f0',
    },
    rvContainer: {
      backgroundColor: 'var(--color-white-base)',
      flexDirection: 'column',
      padding: 'var(--spacing-4)',
      borderRadius: 'var(--spacing-3)',
      border: 'var(--border-width-s) solid var(--color-neutral-light-1)',
    },
    rvTitle: {
      ...theme.typography['text-title2-s'],
      fontFamily: 'var(--font-face1-extended-bold)',
      width: '24.7vw',
      alignSelf: 'center',
    },
    rvTitleTopPosition: {
      width: 'auto',
      alignSelf: 'fex-start',
      marginBottom: 'var(--spacing-2)',
    },
    rvCarousel: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflowX: 'auto',
      gap: 'var(--spacing-2)',
      '-ms-overflow-style': 'none' /* IE and Edge */,

      '&::-webkit-scrollbar': {
        display: 'none' /* Chrome, Safari and Opera */,
      },

      '& > .rvImpressionSensor': {
        width: '24.7vw',
        '&:last-child': {
          marginRight: 0,
        },
      },
      '.rvImpressionSensor': {
        display: 'flex',
        flexShrink: '0',
        flexDirection: 'column',
        position: 'relative',
      },
    },
    rvImage: {
      objectFit: 'cover',
      aspectRatio: '4/5',
      width: '100%',
      height: '100%',
    },
  }),
}
