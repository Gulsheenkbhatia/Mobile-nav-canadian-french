export default {
  baseStyle: () => ({
    productCarouselWrapper: {
      backgroundColor: 'var(--bg-color)',
      position: 'relative',
      width: '100vw',
      marginBottom: '100px',
      ['@media (min-aspect-ratio: 4/2)']: {
        '&:not(.two-slides) .splide__slide': {
          marginRight: '15vw !important',
        },
      },
      ['@media (min-aspect-ratio: 6/2)']: {
        '&:not(.two-slides) .splide__slide': {
          marginRight: '25vw !important',
        },
      },
      '&.two-slides [aria-roledescription="carousel"]': {
        margin: '0 auto 100px',
        '& .splide__slide:last-child': {
          marginRight: '0px !important',
        },
      },
    },
    productCarouselWrapperZoom: {
      backgroundColor: 'var(--bg-color)',
      position: 'relative',
      width: '100vw',

      '& .splide__arrow': {
        display: 'block',
        '&[disabled]': {
          pointerEvents: 'none',
          cursor: 'auto',
          '& svg use': {
            color: '#d9d9d9',
          },
        },
      },
    },
    productMediaItem: {
      position: 'relative',
      height: '100%',
      width: 'auto',
      aspectRatio: '0.8',
    },
    productMediaItemZoom: {
      height: '100%',
      width: 'auto',
    },
    container: {
      '.splide__slide img': {
        borderRadius: '18px',
        height: '100%',
        width: 'auto',
      },
      '.splide__arrow svg': {
        height: '34px',
        width: '34px',
      },
      '.splide__arrow--prev': {
        left: 'var(--spacing-16)',
      },
      '.splide__arrow--next': {
        right: 'var(--spacing-16)',
      },
    },
  }),
}
