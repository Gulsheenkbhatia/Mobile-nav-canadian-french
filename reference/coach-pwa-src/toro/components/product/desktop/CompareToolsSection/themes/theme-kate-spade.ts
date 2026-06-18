export default {
  baseStyle: ({ theme }) => ({
    compareSimilarWrapper: {
      padding: '60px 0 var(--spacing-6)',
      gap: 'var(--spacing-16)',
      flexDirection: 'column',
    },
    headerTitle: {
      ...theme.typography['text-display1-2xl'],
      fontSize: 'var(--text-52)',
      color: 'var(--color-primary)',
      textAlign: 'center',
    },
    recommendationsContentWrapper: {
      flexDirection: 'row',
      gap: 'var(--spacing-3)',
      width: 'calc(100vw - var(--spacing-6))',
      maxWidth: '1440px',
      margin: '0 auto',
    },
    gridContentWrapper: {
      justifyContent: 'center',
    },
    carouselWrapper: {
      flex: 1,
      overflow: 'hidden',
    },
    splideContainer: {
      width: '100%',
      padding: '0 var(--spacing-16)',
    },
    arrows: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'var(--spacing-10)',
      height: 'var(--spacing-10)',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: '50%',
      svg: {
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
      },
    },
    arrowPrev: {
      left: '-64px',
    },
    arrowNext: {
      right: '-64px',
    },
    currentProductWrapper: {
      maxWidth: '244px',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-l)',
      position: 'relative',
      padding: 'var(--spacing-3)',
    },
  }),
}
