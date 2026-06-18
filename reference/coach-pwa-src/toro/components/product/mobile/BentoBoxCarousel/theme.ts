export default {
  baseStyle: () => ({
    carouselTrack: {
      scrollSnapType: 'x mandatory',
      overflowX: 'auto',
      overflowY: 'hidden',
      display: 'grid',
      gridAutoFlow: 'column',
      gridGap: 'var(--spacing-2)',
      gridAutoColumns: '1fr 1fr',
      gridAutoRows: '1fr',
      padding: 'var(--spacing-3)',
      scrollbarWidth: 'none',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '& > *': {
        scrollSnapAlign: 'center',
        flexShrink: 0,
      },
    },
    carouselItem: {
      border: '1px solid var(--color-neutral-light-3)',
      borderRadius: '8px',
      backgroundColor: '#efefef',
      overflow: 'hidden',
      '&.small': {
        width: '46.26vw',
        gridRow: 'span 1',
        gridColumn: 'span 1',
        aspectRatio: '1',
      },
      '&.large': {
        width: '75.53vw',
        gridRow: 'span 2',
        gridColumn: 'span 1',
        aspectRatio: '4/5',
      },
      '&.small img': {
        aspectRatio: '1',
      },
      '&.large img': {
        aspectRatio: '4/5',
      },
      '& img': {
        objectFit: 'cover',
      },
    },
    mediaItemWrapper: {
      height: '100%',
      '& .full-height': {
        height: '100%',
      },
      '& .carousel-video-wrapper': {
        height: '100%',
      },
    },
    modalContent: {
      width: '94.8vw',
      maxWidth: '94.8vw',
      boxShadow: 'none',
      borderRadius: '8px',
      border: '1px solid var(--color-neutral-light-2)',
      overflow: 'hidden',
    },
    modalCloseButton: {
      zIndex: 100,
      top: '15px',
      right: '11px',
      width: 'var(--spacing-10)',
      height: 'var(--spacing-10)',
      padding: 'var(--spacing-3)',
      borderRadius: '1807px',
      backgroundColor: 'var(--color-white-base)',
    },
  }),
}
