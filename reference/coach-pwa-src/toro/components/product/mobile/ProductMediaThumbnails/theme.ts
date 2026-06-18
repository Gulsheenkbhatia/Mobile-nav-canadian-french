export default {
  parts: ['carouselContainer'],
  baseStyle: ({ shouldCenter }) => ({
    carouselContainer: {
      backgroundColor: 'var(--color-page-bg, #F0F0F0)',
      padding: '12px',
      height: '77px',

      '.splide__list': {
        justifyContent: shouldCenter ? 'center' : 'flex-start',
      },

      '& .thumbnail-slide': {
        width: '48px',
        height: '53px',
      },
    },
    thumbnailWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: '6px',
      boxSizing: 'border-box',
      border: 'var(--border-width-s) solid transparent',

      '&.activeThumbnail': {
        borderColor: 'var(--color-black-base)',
      },
    },

    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',

      '& svg': {
        transform: 'scale(2)',
      },
    },
  }),
}
