export default {
  baseStyle: () => ({
    productCarouselWrapper: {
      position: 'sticky',
      width: '100%',

      // Pre-Splide placeholder for loop + `focus: 'center'` (3+ slides only; see `.two-slides` on the
      // wrapper). Matches post-init track offset to eliminate CLS. Calculation accounts for:
      // - Grid right column: 506px
      // - Container border: 2px (1px each side from var(--border-width-s))
      // - Image width: 0.8 * (100vh - 320px) based on hero sizing
      // - Centering: (availableWidth - imageWidth) / 2
      '&:not(.two-slides) .splide:not(.is-initialized)': {
        '& .splide__list': {
          transform: 'translateX(calc((100vw - 508px - 0.8 * (100vh - 320px)) / 2))',
          transition: 'none',
        },
        '& .splide__slide': {
          width: 'calc(0.8 * (100vh - 320px))',
          flexShrink: 0,
        },
      },

      '& video': {
        marginLeft: 'auto',
      },
    },
    lastSlideWithSimilarOptions: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      width: '100%',
      height: '100%',
      zIndex: '12',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      border: 'var(--border-width-s) solid rgba(0, 0, 0, 0.1)',
      borderRadius: 'var(--border-radius-xl)',
      overflow: 'hidden',
      'button.splide__arrow': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '74px',
        height: '74px',
        backgroundColor: 'var(--color-white, #fff)',
        border: '1px solid var(--color-neutral-light-2, #e1e1e1)',
      },
      'button.splide__arrow svg': {
        height: '45px',
        width: '50px',
        outline: 'none',
      },
      'button.splide__arrow--prev': {
        left: '32px',
        '& svg': {
          marginRight: '5px',
        },
      },
      'button.splide__arrow--next': {
        right: '32px',
        '& svg': {
          marginLeft: '5px',
        },
      },
    },
  }),
}
