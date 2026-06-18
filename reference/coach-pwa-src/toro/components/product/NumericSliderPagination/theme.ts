export default {
  parts: ['paginationWrapper', 'paginationContainer', 'inActiveSlide', 'activeSlide'],
  baseStyle: ({ theme }) => ({
    paginationWrapper: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translate(-50%, 0%)',
    },
    paginationContainer: {
      width: '131px',
      height: '36px',
      alignItems: 'center',
      borderRadius: '800px',
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(6px)',
      '@media (min-width: 769px)': {
        width: '111px',
        height: '40px',
      },
      '@media (min-aspect-ratio: 4/2)': {
        w: '84px',
        h: '30px',
      },
    },
    numbers: {
      flexGrow: 1,
      justifyContent: 'center',
      gap: '6px',
      paddingTop: 'var(--spacing-1)',
      color: 'var(--color-black-base)',
      ...theme.typography['text-cta2-xs'],
      '@media (min-aspect-ratio: 4/2)': {
        fontSize: 'var(--text-10)',
        gap: 'var(--spacing-1)',
      },
    },
    arrow: {
      height: '32px',
      width: '32px',
      p: 'var(--spacing-1)',
      zIndex: 1,
      '& svg': {
        fill: 'black',
        stroke: 'black',
        strokeWidth: '0.5',
      },
      '@media (min-aspect-ratio: 4/2)': {
        h: '25px',
        w: '25px',
        '& svg': {
          w: '12px',
          h: '12px',
        },
      },
    },
  }),
}
