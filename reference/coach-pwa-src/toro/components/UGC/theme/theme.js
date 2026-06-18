const buttonStyles = (theme) => ({
  ...theme.typography['text-cta1-s'],
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12)',
  fontWeight: '400',
  color: 'var(--color-black-base)',
  letterSpacing: 'var(--letter-spacing-xl) !important',
  lineHeight: 'var(--line-height-xs) !important',

  background: 'var(--color-white-base)',
  border: '1px solid var(--colors-signal-inactive, #C4C4C4)',
  borderRadius: 'var(--border-radius-s) !important',
  padding: 'var(--spacing-4) var(--spacing-6) !important',
})

const pdpV3WyngMobile = (theme) => ({
  topContent: () => ({
    padding: '0px !important',
    '.mol-banner .banner-container.solid-background .mol-header-block': {
      marginTop: '28px !important',
      marginBottom: 'var(--spacing-3) !important',
      paddingLeft: 'var(--spacing-3) !important',
      paddingRight: 'var(--spacing-3) !important',
    },
    'h1, h2': {
      ...theme.typography['text-display1-m'],
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-26)',
      color: 'var(--color-primary) !important',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textAlign: 'left',
      marginBottom: '5px !important',
    },
    p: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      fontWeight: '400 !important',
      color: 'var(--color-primary) !important',
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textAlign: 'left',
      marginBottom: 'var(--spacing-3) !important',
    },
    'a.btn, a.btn-secondary': {
      ...buttonStyles(theme),
      width: '100%',
    },
  }),
  image: {
    aspectRatio: '1',
    objectFit: 'initial',
  },
  imageContainer: () => ({
    padding: '0px !important',
  }),
  sliderContainer: () => ({
    mb: 'var(--spacing-6)',
    '.slick-track': {
      display: 'flex',
      gap: 'var(--spacing-3)',
    },
  }),
  ugcContainer: {
    root: {
      mb: '40px',
      '& .content-divider::before': {
        display: 'none',
      },
      '&::before': {
        display: 'none',
      },
      '&:empty': {
        mb: 0,
        '& .content-divider::before': {
          display: 'none',
        },
      },
    },
  },
  reviewcta: () => ({
    ...buttonStyles(theme),
    borderColor: 'var(--colors-signal-inactive, #C4C4C4)',
  }),
})

export default {
  parts: [
    'reviewcta',
    'reviewctaContainer',
    'topContent',
    'sliderContainer',
    'imageContainer',
    'modelOverlay',
    'modalContent',
    'modalSliderContainer',
    'image',
    'imagePopup',
    'SocialGallery',
    'ugcContainer',
    'arrowProps',
    'videoContainer',
    'video',
    'authorName',
  ],
  baseStyle: ({ theme }) => ({
    reviewcta: () => ({
      p: '16px 24px',
      borderColor: theme.colors.main.inactive,
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '1.15',
      letterSpacing: '1.25px',
      borderRadius: '2px',
    }),
    reviewctaContainer: {
      textAlign: 'center',
      m: { base: 'var(--spacing-6) auto', md: 'var(--spacing-4) auto ' },
    },
    topContent: (isDesktop) => ({
      p: isDesktop ? '0' : '0 0 10px 0',
      '& #home_body_slot_wyng': {
        textAlign: 'center',
      },
      marginTop: isDesktop ? theme.space.xxl : '0',
      '& .text-display-xl': {
        fontFamily: theme.fontFamily.primaryNormal,
        fontSize: '2.75rem',
        fontWeight: 'bold',
        lineHeight: '1.15',
        letterSpacing: '.0125rem',
      },
      '& .body-text-lg-secondary': {
        fontSize: '1.25rem',
        fontFamily: theme.fontFamily.secondaryNormal,
      },
      '.view-gallery': {
        display: 'none',
      },
    }),
    sliderContainer: (isMobile, isSingleImage) => ({
      mx: isMobile ? 'auto' : '66px',
      ...(isSingleImage && {
        '&.slidercontainer .slick-slider .slick-list, .slick-slider .slick-track': {
          display: 'flex',
          justifyContent: 'center',
        },
      }),
    }),
    videoContainer: {
      aspectRatio: '0.84',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      objectFit: 'cover',
      objectPosition: 'center',
      aspectRatio: '1',
    },
    imageContainer: (isMobile) => ({
      px: isMobile ? '4px' : '6px',
    }),
    modalImageContainer: () => ({
      '& > div': { background: theme.colors.main.white },
    }),
    modelOverlay: {
      backgroundColor: theme.colors.neutral.dark,
      opacity: '0.8',
    },
    buttonViewMore: {
      background: 'none',
      fontFamily: theme.fontFamily.secondaryNormal,
      color: theme.colors.main.black,
      borderBottom: '1px solid #000001',
      fontSize: theme.fontSizes.xxs,
      lineHeight: '13.5px',
      fontWeight: '400',
      '&:focus': {
        boxShadow: 'none',
      },
      '&:hover': {
        textDecoration: 'none',
      },
    },
    modalContent: {
      marginTop: '0',
      marginBottom: '0',
      p: '0',
      justifyContent: 'center',
      borderRadius: '0',
    },
    unitText: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.sm,
      fontWeight: '400',
    },
    viewMore: (more) => ({
      textOverflow: more ? 'ellipsis' : '',
      overflow: more ? 'hidden' : 'auto',
      whiteSpace: more ? 'nowrap' : 'normal',
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: '400',
      fontSize: theme.fontSizes.md,
    }),
    authorName: {
      mt: 'var(--spacing-3)',
      color: 'var(--color-neutral-dark)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
      '@media (max-width: 768px)': {
        ml: '16px',
      },
    },
    modalCloseButton: (isDesktop, isNonShopable) => ({
      zIndex: '100',
      color: isDesktop ? theme.colors.main.black : theme.colors.main.white,
      fontSize: theme.fontSizes.md,
      top: isDesktop ? '16px' : '10px',
      right: isDesktop ? '16px' : '20px',
      background: !isDesktop ? 'rgba(0, 0, 0, 0.1)' : null,
      position: isDesktop || isNonShopable ? 'absolute' : 'fixed',
      '&:focus': {
        boxShadow: 'none',
      },
    }),
    productSlider: (isDesktop) => {
      const css = {
        display: 'flex',
        flexDirection: isDesktop ? 'column' : 'row',
      }
      css['&::-webkit-scrollbar-track'] = { background: theme.colors.main.white }
      css['&::-webkit-scrollbar-thumb'] = {
        backgroundColor: theme.colors.main.gray,
        borderRadius: '20px',
        border: '3px solid',
        borderColor: theme.colors.main.gray,
      }
      if (!isDesktop) {
        css.overflowX = 'auto'
        css.overflowY = 'hidden'
        css.maxWidth = '100vw'
        css['&::-webkit-scrollbar'] = { h: '6px', '-webkit-appearance': 'none' }
        css['& a:not(:first-child)'] = { ml: '12px' }
        css['& a:not(:first-child)'] = { ml: '12px' }
      } else {
        css.overflowY = 'auto'
        css.overflowX = 'hidden'
        css['&>a'] = { mr: '12px' }
        css['&::-webkit-scrollbar'] = { w: '6px' }
        css.height = '400px'
      }
      return css
    },
    modalSliderContainer: (isMobile, isNonShopable) => {
      return {
        background: theme.colors.main.white,
        position: isNonShopable ? 'relative' : 'unset',
        h: isMobile && !isNonShopable ? 'fit-content' : 'auto',
        '.slick-slide': {
          maxHeight: !isMobile ? '90vh' : null,
        },
      }
    },
    image: {
      aspectRatio: '0.84',
      objectFit: 'contain',
    },
    imagePopup: (isDesktop) => ({
      objectFit: isDesktop ? 'contain' : '',
      aspectRatio: '0.84',
    }),

    SocialGallery: {
      mainContainerWrapper: {
        p: '0 12px',
      },
      ugcContainer: {
        margin: '0 auto',
      },
      showMore: {
        mt: '32px',
        mb: '24px',
        textAlign: 'center',
      },
    },
    ugcContainer: {
      root: {
        mb: 'var(--spacing-12)',
        '&::before': {
          width: '100%',
          left: 0,
        },
      },
    },
    arrowProps: {
      fill: theme.colors.main.black,
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      '&:hover': {
        cursor: 'pointer',
      },
      '&:focus, & svg:focus': {
        outline: 'unset',
        outlineOffset: 'unset',
      },
      svg: {
        width: '48px',
        height: '48px',
      },
    },
  }),
  variants: {
    pdpV3WyngMobile: ({ theme }) => ({
      ...pdpV3WyngMobile(theme),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      ...pdpV3WyngMobile(theme),
    }),
    wyngMobileNotCentered: () => ({
      imageContainer: () => ({
        padding: '0px !important',
      }),
      sliderContainer: () => ({
        mb: 'var(--spacing-6)',
        '.slick-track': {
          display: 'flex',
          gap: 'var(--spacing-3)',
        },
      }),
    }),
  },
}
