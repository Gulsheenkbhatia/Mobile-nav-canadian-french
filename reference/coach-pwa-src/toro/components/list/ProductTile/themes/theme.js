const newPlpStyles = (theme) => ({
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
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      '.video-play-pause-btn': {
        transition: 'transform 0.3s ease',
        svg: {
          width: '40px',
          height: '40px',
        },
      },
      '&.is-thumbnail-hovered .video-play-pause-btn': {
        transform: 'translateY(-40px)',
      },
    },
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
    backgroundColor: '#f0f0f0',
    paddingBottom: 'var(--chakra-space-6)',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      height: '100%',
    },
    '.swatch-slider-chevron-right, .swatch-slider-chevron-left': {
      opacity: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      transition: 'all 0.3s ease',
      '&:focus-visible': {
        opacity: 1,
      },
      svg: {
        width: '24px',
        height: '24px',
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
    pt: '12px',
    backgroundColor: '#f0f0f0',
    height: '100%',
  },
  tileInfoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },
  tileProductName: {
    px: 0,
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      px: 'mar',
    },
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
      margin: '0 var(--spacing-4)',
    },
    m: 0,
    p: 0,
  },
  productColorSwatches: {
    wrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-3) var(--spacing-3) 10px var(--spacing-3)',
        // We need 12px, but the price component lineHeight style makes a little spacing
      },
      padding: 'var(--spacing-3) var(--spacing-2)',
    },
    swatchImage: {
      borderRadius: '50%',

      '&::after': {
        content: '""',
        display: 'block',
        border: '1px solid rgba(0,0,0,0.2)',
        w: '24px',
        h: '24px',
        borderRadius: '50%',
        position: 'absolute',
      },
    },

    swatchWrapper: {
      minWidth: '24px',
      '&.activeColorSwatch img': {
        padding: '2px',
      },
      '&.disabled-color::after': {
        // Need zIndex to overlap the main image
        zIndex: '1',
        content: '""',
        cursor: 'pointer',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '18px',
        height: '18px',
        borderRadius: '2px',
        transform: 'translate(-50%, -50%)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMTFMMTEgMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K")',
      },
      '&:not(:last-child)': {
        marginRight: theme.space.s,
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
  viewSimilarButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    width: 'auto',
    height: 'var(--spacing-4)',
    color: 'var(--color-primary)',
    outline: 'none',
    background: 'none',
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: 'var(--text-10)',
    letterSpacing: 'var(--letter-spacing-xs)',
    margin: 0,
    lineHeight: 1,
    textTransform: 'none',

    span: {
      position: 'relative',
    },

    svg: {
      width: '14px',
      height: '10px',
      stroke: 'var(--color-primary)',
    },
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      span: {
        top: '2px',
        paddingBottom: 'var(--spacing-1)',
        borderBottom: '1px solid var(--border-color-primary)',
      },
      '&:hover:not(:disabled), &:active': {
        background: 'none',
      },
    },
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      p: '17px var(--spacing-3)',
      gap: '6px',
      background: 'var(--color-white-base)',
      borderRadius: '30px',
      border: '1px solid var(--color-neutral-light-2)',
      span: {
        fontSize: 'var(--text-12)',
        top: '1px',
      },
      svg: {
        stroke: 'var(--color-primary)',
      },

      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-primary)',

        '& > span': {
          color: 'var(--color-secondary)',
        },

        '& > svg': {
          stroke: 'var(--color-secondary)',
        },
      },

      '&:hover:disabled': {
        backgroundColor: 'inherit',
      },
    },
    tileRatingsLink: {
      marginTop: 'var(--spacing-3)',
    },
  },
})

export default {
  parts: [
    'tileWrapper',
    'tileImageBadgeWrapper',
    'productThumbnail',
    'tileInfoWrapper',
    'tileDescriptionWrapper',
    'tileUpperBadgeWrapper',
    'tileUpperBadge',
    'tileProductName',
    'tileProductNameText',
    'priceWrapper',
    'tileSwatchWrapper',
    'tileLowerBadgeWrapper',
    'tileMaterialWrapper',
    'onPurposeBadgeWrapper',
    'onPurposeImage',
    'productColorSwatches',
    'dotsContainer',
    'dot',
    'sliderLine',
    'slider',
    'bottomWrapper',
    'bottomGradient',
    'viewSimilarButton',
    'ratingWrapper',
    'ratingIconWrapper',
    'ratingStarCount',
    'ratingReviewCount',
    'viewSimilarLinkWrapper',
    'viewSimilarButtonText',
    'tileRatingsLink',
    'imagesSliderItem',
    'carouselImage',
    'tilePromoCalloutWrapper',
  ],
  baseStyle: ({ theme }) => ({
    tileWrapper: {
      position: 'relative',
      minWidth: '0',
      '& .product-tile__container.col-6': {
        maxWidth: '100%',
      },
    },

    tileImageBadgeWrapper: {
      top: '13px',
      left: 's',
      right: 'xxl',
      zIndex: '10',
    },
    membershipExclusiveBadgeWrapper: {
      top: '8px',
      left: 'xs',
      right: 'auto',
      zIndex: '10',
      '& .custom-badge': {
        '& .custom-badge-content': {
          lineHeight: 'var(--line-height-xl)',
          fontSize: 'var(--text-10)',
        },
        '& .custom-badge-content label': {
          padding: 0,
          backgroundColor: 'unset',
        },
        p: '2px 0px 2px 18px',
        backgroundColor: 'rgba(225, 225, 225, 0.50)',
      },
    },
    productThumbnail: {
      position: 'relative',
      minHeight: 'var(--min-mobile-tile-height)',
      overflow: 'hidden',
      mb: 'mar',
      bg: '#EFEFEF',
      '.video-play-pause-btn': {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 'var(--spacing-2)',
        cursor: 'pointer',
      },
      [`@media (min-width: ${theme.breakpoints.lgx})`]: {
        '&:focus-within .quick-view-container': {
          display: 'inline-flex',
        },
      },
    },
    tileDescriptionWrapper: {
      pb: ['0px', '0px', '0px', '0px', '5px', '10px'],
      mb: ['0px', '-10px', '-10px', '-10px', '0px'],
    },
    tileUpperBadgeWrapper: {
      mb: 'xs',
      mx: 's',
    },
    tileUpperBadge: {
      backgroundColor: 'red',
    },
    tileProductName: {
      px: 's',
    },
    tileProductNameText: {
      textOverflow: 'ellipsis',
      fontFamily: theme.fontFamily.secondaryNormal,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      lineClamp: 2,
      WebkitLineClamp: 2,
    },
    priceWrapper: {
      mb: 'xs',
      px: 's',
      pb: '0px',
    },
    tileSwatchWrapper: {
      my: 's',
      mx: 'xs',
      px: 'xs',
      width: 'auto',
      '.swatch-slider-chevron-right, .swatch-slider-chevron-left': {
        svg: {
          '&:focus': {
            outline: 'none !important',
          },
        },
      },
      '.swatch-slider-chevron-right': {
        right: '20px',
        '@media (max-width: 769px)': {
          right: '0px',
        },
      },
    },
    tileLowerBadgeWrapper: {
      mb: 'xs',
      mx: 's',
    },
    tileMaterialWrapper: {
      mb: 'xs',
      px: 's',
    },
    tileMaterial: {
      textTransform: 'capitalize',
      color: theme.colors.neutral.dark,
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    onPurposeBadgeWrapper: { zIndex: 5, left: 2, top: 12, position: 'absolute' },
    onPurposeImage: { height: 12, width: 'auto' },
    productColorSwatches: {
      swatchImage: {
        img: {
          borderRadius: '50%',
          w: '24px',
          h: '24px',
        },
      },
      swatchWrapper: {
        w: '24px',
        h: '24px',
        '&.activeColorSwatch img': {
          padding: '3px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-primary)',
        },
        '&.activeColorSwatch img:focus-visible': {
          outline: '0px solid transparent',
        },
      },
      swatchSlider: {
        gap: 'var(--spacing-4)',
        alignItems: 'start',
        justifyContent: 'flex-start',
      },
    },
    dotsContainer: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      boxSizing: 'border-box',
      alignItems: 'center',
      height: '15.5px',
      pb: 'var(--spacing-1)',
    },
    dot: {
      border: '0',
      p: '0',
      borderRadius: '50%',
      display: 'inline-block',
      width: '5.5px',
      height: '5.5px',
      margin: '3px',
      transition: 'transform 0.2s linear 0s',
      bg: theme.colors.main.inactive,
      '&.active': {
        transform: 'scale(1.25)',
        opacity: 0.75,
        bg: theme.colors.neutral.dark,
      },
    },
    sliderLine: {
      width: 'calc(100% * 0.55)',
      height: '2px',
      background: 'var(--color-white-base)',
      borderRadius: '800px',
    },
    slider: {
      background: 'var(--color-neutral-medium)',
      height: '100%',
      transitionProperty: 'margin-left',
      transitionDuration: 'var(--transition-duration-quick)',
      borderRadius: '800px',
    },
    tileRatingsLink: {
      marginRight: '12px',
      marginLeft: '12px',
      paddingBottom: '2px',
      minHeight: '11px',
      marginTop: 'unset',
    },
    sizeDrawerBtn: {
      textTransform: 'capitalize',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      ...newPlpStyles(theme),
    }),
    onModelPlp2Up: ({ theme }) => ({
      ...newPlpStyles(theme),
      tileWrapper: {
        gridColumn: 'span 2/span 2',
        m: 'var(--spacing-2) var(--spacing-3)',
        pb: 'var(--spacing-6)',
        borderRadius: 'var(--border-radius-xl)',
        border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
        backgroundColor: 'var(--color-neutral-light)',
        boxShadow:
          '0px 251px 70px 0px rgba(0, 0, 0, 0.00), 0px 161px 64px 0px rgba(0, 0, 0, 0.00), 0px 90px 54px 0px rgba(0, 0, 0, 0.02), 0px 40px 40px 0px rgba(0, 0, 0, 0.03), 0px 10px 22px 0px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        '& .promoCalloutWrapper .callout-message-container-content': {
          textAlign: 'center',
        },
      },
      tileInfoWrapper: {
        '& > *': {
          backgroundColor: 'var(--color-neutral-light) !important',
        },
      },
      tileImageBadgeWrapper: {
        top: '16px',
        width: '50%',
        left: 'unset',
        right: 'unset',
        display: 'flex',
        justifyContent: 'center',
      },
      imagesSliderItem: {
        width: '50%',
        scrollSnapAlign: 'start',
      },
      carouselImage: {
        width: '50%',
        '& > img': {
          width: '100%',
        },
      },
      tileSwatchWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'center',
          margin: '0 var(--spacing-4)',
        },
        m: 0,
        p: 0,
        '&::before': {
          background: 'unset',
        },
        '&::after': {
          background: 'unset',
        },
      },
      tileLowerBadgeWrapper: {
        mx: 'auto',
      },
      tileUpperBadgeWrapper: {
        mx: 'auto',
      },
    }),
    thinkPlp: ({ theme }) => {
      const styles = newPlpStyles(theme)
      return {
        ...styles,
        tileWrapper: {
          ...styles.tileWrapper,
          '& .tilePromoCalloutWrapper': {
            display: 'none',
          },
          '& .plpV2OrV3Atc': {
            backgroundColor: 'transparent',
            borderColor: 'var(--color-price-comp-value)',
            lineHeight: '10px',
          },
          '& .notifyMeButton': {
            backgroundColor: 'transparent',
            borderColor: 'var(--color-neutral-light-2)',
          },
          '& .product-tile-vs-area': {
            display: 'none',
          },
          '& .product-tile-review-area': {
            display: 'none',
          },
          '.price-wrapper:not(:has(.product-color-swatches-wrapper))': {
            marginTop: 'var(--spacing-3)',
          },
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            '& .price-wrapper .scrollableContent': {
              paddingBottom: 'var(--spacing-3)',
            },
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            '& .price-wrapper:not(:has(.scrollable-container))': {
              marginTop: 'var(--spacing-4)',
            },
            '& .price-wrapper:has(.scrollable-container)': {
              marginTop: 0,
            },
            '& .price-wrapper .scrollableContent': {
              paddingTop: 'var(--spacing-4)',
              paddingBottom: 'var(--spacing-4)',
            },
            '& .product-tile-cta-area': {
              display: 'none',
            },
          },
        },
        tileProductName: {
          ...styles.tileProductName,
          mt: 'var(--spacing-4)',
          '& .product-tile-cta-area': {
            marginTop: 'var(--spacing-0)',
          },
        },
        priceWrapper: {
          ...styles.priceWrapper,
          paddingBottom: 0,
        },
        viewSimilarButton: {
          display: 'none',
        },
        tileImageBadgeWrapper: {
          display: 'none',
        },
        tileUpperBadgeWrapper: {
          display: 'none',
        },
        ratingWrapper: {
          display: 'none',
        },
        tileRatingsWrapper: {
          display: 'none',
        },
        tileRatingsLink: {
          display: 'none',
        },
        viewSimilarCTAWrapper: {
          display: 'none',
        },
      }
    },
  },
  sizes: {
    '3up': {
      tileWrapper: {
        '& .comparablePriceWrapper span': {
          fontSize: 'var(--text-10)',
        },
      },
      productThumbnail: {
        background: 'var(--color-neutral-light-1)',
      },
      carouselImage: {
        objectFit: 'contain',
      },
      imagesSliderItem: {
        '& img': {
          objectFit: 'contain',
        },
      },
    },
  },
}
