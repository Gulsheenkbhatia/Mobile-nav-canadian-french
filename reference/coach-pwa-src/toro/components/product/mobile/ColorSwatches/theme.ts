export default {
  baseStyle: ({ theme }) => ({
    tileImageBadgeWrapper: {
      top: '16px',
      width: '100%',
      left: 'unset',
      right: 'unset',
      display: 'flex',
      justifyContent: 'center',
    },
    bottomWrapper: {
      display: 'flex',
      flexDirection: 'column-reverse',
    },
    productThumbnail: {
      mb: 0,
      position: 'relative',
    },
    bottomGradient: {
      position: 'absolute',
      width: '100%',
      height: '20%',
      bottom: '0px',
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.12) 100%)',
      backgroundBlendMode: 'hard-light',
    },
    dotsContainer: {
      position: 'absolute',
      bottom: 0,
    },
    tileWrapper: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-neutral-light-1)',
      paddingBottom: 'var(--chakra-space-6)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        height: '100%',
      },
      '.swatch-slider-chevron-right, .swatch-slider-chevron-left': {
        opacity: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'all 0.3s ease',
        svg: {
          width: 'var( --spacing-6)',
          height: 'var( --spacing-6)',
          '&:focus': {
            outline: 'none !important',
          },
        },
      },
      '.swatch-slider-chevron-left': {
        left: '30px',
      },

      '.swatch-slider-chevron-right': {
        right: '30px',
      },
      '&:hover .swatch-slider-chevron-left': {
        left: '5px',
        opacity: 1,
      },

      '&:hover .swatch-slider-chevron-right': {
        right: '5px',
        opacity: 1,
      },
    },
    tileDescriptionWrapper: {
      display: 'flex',
      flexDirection: 'column',
      pt: 'var(--spacing-3)',
      backgroundColor: 'var(--color-neutral-light-1)',
      height: '100%',
    },
    tileInfoWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
    },
    tileProductName: {
      px: 0,
    },
    tileLowerBadgeWrapper: {
      mx: 'var(--spacing-4)',
    },
    priceWrapper: {
      display: 'flex',
      justifyContent: 'center',
      mb: 0,
      pb: '14px',
    },
    tileProductNameText: {
      ...theme.typography['text-body1-l'],
      lineHeight: 'var(--line-height-150)',
      fontFamily: 'var(--font-face1-normal)',
      display: '-webkit-box',
      lineClamp: 1,
      WebkitLineClamp: 1,
      whiteSpace: 'normal',
      textAlign: 'center',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'block',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        fontFamily: theme.fontFamily.primaryNormal,
        color: theme.colors.main.primary,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        lineClamp: 0,
        WebkitLineClamp: 0,
      },
    },
    tileMaterial: {
      textAlign: 'center',
    },
    ratingWrapper: {
      justifyContent: 'center',
    },
    sliderLine: {
      background: '#CDCDCD', //need design token variable
    },
    tileSwatchWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        justifyContent: 'center',
        margin: '0 var(--spacing-3)',
      },
      m: 0,
      p: 0,
    },
    productColorSwatches: {
      wrapper: {
        padding: 0,
      },
      swatchImage: {
        borderRadius: '50%',

        '&::after': {
          content: '""',
          display: 'block',
          border: '1px solid rgba(0,0,0,0.2)',
          w: '100%',
          h: '100%',
          borderRadius: '50%',
          position: 'absolute',
        },
      },

      swatchWrapper: {
        minWidth: 'var( --spacing-6)',
        marginRight: 'var(--spacing-2)',
        height: 'var(--spacing-10)',
        width: 'var(--spacing-10)',
        '&.activeColorSwatch img': {
          padding: '2px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-primary)',
        },
        '&.disabled-color::after': {
          // Need zIndex to overlap the main image
          zIndex: '1',
          content: '""',
          cursor: 'pointer',
          position: 'absolute',
          top: '50%',
          left: '50%',
          borderRadius: '2px',
          transform: 'translate(-50%, -50%)',
        },
        '&:not(:last-child)': {
          marginRight: '0.5rem',
        },
      },
      arrows: {
        '&[disabled]': {
          cursor: 'auto',
        },
        'svg:focus': {
          outline: 'none',
        },
      },
      mainSwatchesWrapper: {
        width: '165px',
        justifyContent: 'center',
      },
    },
  }),
}
