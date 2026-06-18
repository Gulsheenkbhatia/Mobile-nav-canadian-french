export default {
  baseStyle: ({ theme }) => ({
    sectionSliderWrapper: {
      background: 'var(--color-page-bg, #F0F0F0)',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionSliderTitle: {
      ...theme.typography['text-display4-xl'],
      color: 'var(--color-black-base)',
      '@media (max-height: 800px)': {
        ...theme.typography['text-display4-xl'],
        fontSize: 'var(--text-32)',
      },
    },
    sectionSliderPagination: {
      position: 'relative',
      height: '34px',
    },
    sectionSliderContainer: {
      padding: 'var(--spacing-10) 0',
    },
    arrows: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '22px',
      height: '22px',
      '& > svg': {
        transform: 'scale(1.7)',
      },
    },
    arrowNext: {
      right: '-36px',
    },
    arrowPrev: {
      left: '-36px',
    },
  }),
}
