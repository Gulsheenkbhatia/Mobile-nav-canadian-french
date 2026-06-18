export default {
  parts: [
    'galleryOuter',
    'galleryOuterImmersive',
    'galleryOuterDiscover',
    'galleryInner',
    'galleryInnerImmersive',
    'galleryInnerDiscoverNarrow',
  ],

  baseStyle: ({ theme }) => ({
    galleryOuter: {
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
    },

    galleryOuterImmersive: {
      flex: 1,
      minHeight: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },

    galleryOuterDiscover: {
      flex: 1,
      minHeight: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      touchAction: 'pan-y',
      userSelect: 'none',
      '&, & *': { touchAction: 'pan-y' },
      '& img': { WebkitUserDrag: 'none' },
    },

    galleryInner: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      position: 'relative',
      transform: 'scale(1)',
      transformOrigin: 'top center',
      overflow: 'hidden',

      '& .pdp-carousel-d': {
        maxWidth: '100%',
        width: '100%',
        overflowX: 'hidden',
      },

      '& .splide__arrows': {
        position: 'absolute',
        top: '50%',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        transform: 'translateY(-50%)',
        zIndex: 2,
      },

      '& .splide__arrow': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        width: '44px',
        height: 'var(--spacing-8)',
        borderRadius: '800px',
        padding: 'var(--spacing-1) 10px',
        background: 'var(--color-secondary)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.6)',

        opacity: 1,
        pointerEvents: 'auto',

        '& svg': {
          fill: 'none',
          width: 'var(--spacing-6)',
          height: 'var(--spacing-6)',
        },
      },

      '& .splide__arrow--prev svg': {
        transform: 'rotate(180deg)',
      },
    },

    galleryInnerImmersive: {
      flex: 1,
      minHeight: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      px: '10px',
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
      '& .carousel-video-wrapper': {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      },
      '& .carousel-video-wrapper > div': {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      },
      '& .pdp-carousel-d img': {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      },
      '& .pdp-carousel-d': {
        maxWidth: '100%',
        width: '100%',
        overflowX: 'hidden',
        flex: 1,
        minHeight: 0,
        height: '100%',
        maxHeight: '100%',
        borderRadius: 'var(--border-radius-m)',
      },
    },

    galleryInnerDiscoverNarrow: {
      flex: 1,
      minHeight: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .pdp-carousel-d': {
          flex: 1,
          minHeight: 0,
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100%',
          overflow: 'hidden',
        },
        '& .pdp-carousel-d > *': {
          maxWidth: '100%',
          minHeight: 0,
          overflow: 'hidden',
          maxHeight: 'min(50dvh, 440px)',
        },
        '& img, & .pdp-carousel-d img, & .pdp-carousel-d div img': {
          maxHeight: 'min(50dvh, 440px) !important',
          maxWidth: '100% !important',
          width: '100% !important',
          height: '100% !important',
          objectFit: 'contain !important',
          objectPosition: 'center center !important',
          overflow: 'hidden !important',
        },
        '& video': {
          maxHeight: 'min(50dvh, 440px)',
          objectFit: 'contain',
          width: '100%',
          height: 'auto',
        },
      },
      [`@media (max-width: ${theme.breakpoints.sm}) and (max-height: 740px)`]: {
        '& .pdp-carousel-d > *': {
          maxHeight: 'min(42dvh, 300px)',
        },
        '& img, & .pdp-carousel-d img, & .pdp-carousel-d div img': {
          maxHeight: 'min(42dvh, 300px) !important',
        },
        '& video': {
          maxHeight: 'min(42dvh, 300px)',
        },
      },
    },
  }),
}
