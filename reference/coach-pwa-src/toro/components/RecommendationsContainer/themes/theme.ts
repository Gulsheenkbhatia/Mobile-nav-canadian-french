const arrowStyles = {
  top: 'calc(50% - var(--spacing-8))',
  color: 'var(--color-neutral-dark)',
  backgroundColor: 'var(--color-white-base)',
  width: '24px',
  height: '24px',
  transform: 'none',
  boxShadow: 'var(--shadow-ltrb)',
  '& svg': {
    margin: '0 auto',
  },
}

const aeDrawerStyles = {
  baseRecommendationContentDivider: {
    '&.content-divider::before': {
      display: 'none',
    },
    minHeight: 'auto',
    margin: '0',
  },
  baseRecommendationArrowPrev: {
    ...arrowStyles,
    left: '-12px', // missing in the design token
  },
  baseRecommendationArrowNext: {
    ...arrowStyles,
    right: '-12px', // missing in the design token
  },
}

const tabbedArrowStyles = {
  width: '64px',
  height: '48px',
  backgroundColor: 'var(--color-white-base)',
  border: '1px solid var(--color-neutral-light-2)',
  borderRadius: 'var(--border-radius-full)',
  transform: 'translateY(-50%)',
  top: '50%',
  bottom: 'auto',
  '& svg': {
    width: '24px',
    height: '24px',
  },
  '&:not(:disabled)': {
    display: 'flex',
  },
}

const goneViralRecommendationStyles = (theme) => ({
  baseRecommendationContentDivider: {
    minHeight: 'auto',
    m: '0',
    '&.content-divider::before': {
      display: 'none',
    },
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      minHeight: 'unset',
      height: '100%',
    },
  },
  baseRecommendationWrapper: {
    '&&': {
      backgroundColor: 'var(--color-white-base)',
      pt: '0',
      pb: '0',
    },
  },
  baseRecommendationMobileItems: {
    p: '0',
    m: '0',
    gridGap: '10px',
  },
})

export default {
  parts: [
    'baseRecommendationRoot',
    'baseRecommendationContentDivider',
    'baseRecommendationWrapper',
    'baseRecommendationTitle',
    'baseRecommendationDesktopSliderWrapper',
    'baseRecommendationArrowStyles',
    'baseRecommendationArrowPrev',
    'baseRecommendationArrowNext',
    'baseRecommendationSplidePadding',
    'baseRecommendationMobileWrapper',
    'baseRecommendationMobileItems',
    'fallbackMessageContainer',
    'fallbackMessage',
    'baseRecommendationSliderContainer',
    'grid2Up',
  ],
  baseStyle: ({ theme }) => ({
    baseRecommendationContentDivider: {
      p: '0',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: '316px',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        minHeight: '455px',
        m: '0 auto 32px',
      },
    },
    baseRecommendationWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        pt: 'var(--spacing-6)',
        pb: 'var(--spacing-8)',
        ['[data-recommendations-container="recentlyviewed"] &']: {
          pt: '30px',
        },
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        py: theme.space.xxl,
      },
    },
    baseRecommendationTitle: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-44)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-24)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xs)',
        textAlign: 'start',
        px: 'var(--spacing-3)',
      },
    },
    baseRecommendationDesktopSliderWrapper: {
      mt: 'var(--spacing-8)',
      mx: 'auto',
      px: '24px',
      'li > div': {
        height: '100%',
      },
    },
    baseRecommendationArrowStyles: {
      transform: 'scale(2.5)',
      top: 'inherit',
      bottom: 'calc(100% - 24px - var(--certona-desktop-product-tile-height) / 2)',
      boxShadow: 'initial',
      '&:focus, & svg:focus': {
        outline: 'unset',
        outlineOffset: 'unset',
      },
    },
    baseRecommendationArrowPrev: {
      left: '-40px',
    },
    baseRecommendationArrowNext: {
      right: '-61px',
    },
    baseRecommendationSplidePadding: {
      left: 'initial',
      right: 'initial',
    },

    baseRecommendationMobileWrapper: {
      maxWidth: '100vw',
    },
    baseRecommendationMobileItems: {
      maxWidth: '100vw',
      overflowX: 'scroll',
      gridGap: 'var(--spacing-2)',
      pr: 'var(--spacing-3)',
      pl: 'var(--spacing-3)',
      mt: 'var(--spacing-4)',
    },
    fallbackMessageContainer: {
      display: 'flex',
      height: '219px',
      padding: '0px var(--spacing-4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 'var(--border-radius-s)',
      border: '1px solid var(--color-neutral-light-2)',
      background: 'var(-color-neutral-light)',
      margin: 'var(--spacing-4) var(--spacing-3) var(--spacing-1)',
    },
    fallbackMessage: {
      ...theme.typography['text-body1-s'],
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textAlign: 'center',
    },
    clpWrapper: {
      maxWidth: theme.maxLayoutWidth,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&::before': {
            display: 'none',
          },
        },
      },
      baseRecommendationWrapper: {
        '&&': {
          pl: 'var(--spacing-3)',
          p: 'var(--spacing-6) 0',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            pl: 0,
          },
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textAlign: 'center',
          lineHeight: theme.lineHeights.xs,
          fontSize: 'var(--text-28)',
        },
      },
      baseRecommendationMobileItems: {
        gridGap: 'var(--spacing-1)',
        mt: 'var(--spacing-3)',
      },
      baseRecommendationDesktopSliderWrapper: {
        '& .splide__slide': {
          m: '0 6px!important',
          '& > div': {
            maxWidth: '215px',
            m: 'auto',
          },
        },
        maxWidth: '100%',
        mt: 'var(--spacing-4)',
        mx: 0,
        px: 0,
      },
      baseRecommendationArrowStyles: {
        width: '56px',
        height: '56px',
        transform: 'none',
        boxShadow: '0px 7px 16px rgba(0,0,0,0.05)',
        backgroundColor: 'var(--color-white-base)',
        '& svg': {
          margin: 'auto',
          height: 'var(--spacing-6)',
          width: 'var(--spacing-6)',
        },
        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light)',
          '& svg': { opacity: 0.4 },
        },
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          left: 'var(--spacing-6)',
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          right: 'var(--spacing-6)',
        },
      },
      baseRecommendationSplidePadding: {
        left: 'initial',
        right: 'initial',
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&::before': {
            display: 'none',
          },
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          pt: '26px',
          pb: '35px',
          ['[data-recommendations-container="recentlyviewed"] &']: {
            pt: '30px',
          },
        },
      },
    }),
    recommendationsOnHP: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          pt: 'var(--spacing-8)',
        },
      },
      baseRecommendationTitle: {
        px: 'var(--spacing-6)',
        py: 'var(--spacing-3)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textAlign: 'center',
        },
      },
      baseRecommendationMobileItems: {
        mt: 'var(--spacing-6)',
        gridGap: 'var(--spacing-1)',
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      baseRecommendationContentDivider: {
        mt: '20px',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          minHeight: 'unset',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          fontFamily: 'var(--font-face1-extended-bold)',
          lineHeight: theme.lineHeights.s,
          textAlign: 'start',
          color: theme.colors.main.primary,
          px: theme.space.s3,
        },
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: '6px',
        },
      },
    }),
    aeDrawer: ({ theme }) => ({
      ...aeDrawerStyles,
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          paddingLeft: 'var(--spacing-2)',
        },
        paddingLeft: 0,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: '13px',
          paddingBottom: 'var(--spacing-3)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingTop: '13px',
          paddingBottom: 'var(--spacing-3)',
        },
        '.btn-wishlist-container-recommend': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          button: {
            padding: '0',
          },
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: 0,
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'left',
        },
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
        textAlign: 'left',
        paddingLeft: '20px',
      },
      baseRecommendationMobileWrapper: {
        marginTop: 'var(--spacing-2)',
      },
      baseRecommendationMobileItems: {
        p: 0,
        m: 0,
        gridGap: 'var(--spacing-1)',
        '&::after': {
          content: "''",
          flex: '0 0 var(--spacing-1)',
        },
      },
      baseRecommendationDesktopSliderWrapper: {
        px: '20px',
        width: '100%',
        marginTop: 'var(--spacing-3)',
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      ...aeDrawerStyles,
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          px: 'var(--spacing-2)',
          py: 'var(--spacing-4)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          px: '20px', // missing in the design token
          py: 'var(--spacing-4)',
        },
      },
      baseRecommendationMobileItems: {
        display: 'grid',
        columnGap: 's1',
        rowGap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        m: 0,
        p: 0,
      },
      baseRecommendationTitle: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
        paddingBottom: '10px', // missing in the design token
        textAlign: 'left',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingLeft: 0,
          paddingRight: 0,
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
        },
      },
    }),
    recomCarouselThink: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '1px',
          mb: 0,
          mx: 0,
        },
      },
      baseRecommendationWrapper: {
        '&&': {
          pl: 'var(--spacing-3)',
          p: 'var(--spacing-6) 0',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            pl: 0,
          },
        },
      },
      baseRecommendationTitle: {
        lineHeight: theme.lineHeights.xs,
        textAlign: 'left',
      },
      baseRecommendationMobileItems: {
        gridGap: 'var(--spacing-1)',
        mt: 'var(--spacing-3)',
      },
      baseRecommendationDesktopSliderWrapper: {
        '& .splide__slide': {
          m: '0 6px!important',
          '& > div': {
            maxWidth: '215px',
            m: 'auto',
          },
        },
        maxWidth: '100%',
        mt: 'var(--spacing-4)',
        mx: 0,
        px: 0,
      },
      baseRecommendationArrowStyles: {
        width: 'inherit',
        height: 'inherit',
        boxShadow: 'var(--shadow-ltr)',
        backgroundColor: 'var(--color-white-base)',
        '& svg': {
          margin: 'auto',
        },
        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light)',
          '& svg': { opacity: 0.4 },
        },
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          left: 'var(--spacing-6)',
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          right: 'var(--spacing-6)',
        },
      },
      baseRecommendationSplidePadding: {
        left: 'initial',
        right: 'initial',
      },
    }),
    similarProductRecommendation: ({ theme }) => ({
      baseRecommendationTitle: {
        display: 'none',
      },
      baseRecommendationMobileItems: {
        mt: 0,
        px: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: 'var(--spacing-1)',
        rowGap: 'var(--spacing-5)',
        marginBottom: 'var(--spacing-6)',
        width: '100%',
      },
    }),
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: 'var(--spacing-3)',
          mb: 'var(--spacing-6)',
        },
      },
      baseRecommendationTitle: {
        display: 'none',
      },
      baseRecommendationMobileItems: {
        mt: 0,
        px: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: 'var(--spacing-1)',
        rowGap: 'var(--spacing-5)',
        marginBottom: 'var(--spacing-6)',
        width: '100%',
      },
    }),
    tabbedHP: ({ theme }) => ({
      baseRecommendationRoot: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-neutral-light-1)',
        },
      },
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '455px',
          m: '0 auto',
        },
      },
      baseRecommendationWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          py: 'var(--spacing-12)',
          justifySelf: 'center',
          maxWidth: '1440px',
        },
      },
      baseRecommendationTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xs'],
          fontFamily: 'var(--font-face1-extended-bold)',
          px: '20px',
        },
      },
      baseRecommendationDesktopSliderWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-4)',
          px: '20px',
          width: '100%',
        },
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...tabbedArrowStyles,
          left: 0,
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...tabbedArrowStyles,
          right: 0,
        },
      },
      fallbackMessageContainer: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mx: 0,
          px: '20px',
          borderRadius: '10px',
          height: '323px',
          borderColor: 'var(--color-neutral-light-3)',
        },
      },
      fallbackMessage: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          mt: 0,

          '& strong': {
            ...theme.typography['text-display4-xs'],
            fontWeight: 700,
          },
        },
      },
      baseRecommendationSliderContainer: {
        '& .splide__slide': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            marginRight: 'var(--spacing-2)',
            width: 'calc((100% + var(--spacing-2)) / 4 - var(--spacing-2)) !important', // override inline styles from SplideSlider
          },
        },
      },
    }),
    tabbedPLP: ({ theme }) => ({
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: theme.space.s3,
        },
      },
      baseRecommendationRoot: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-neutral-light)',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          px: 'var(--spacing-12)',
        },
      },
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '455px',
          m: '0 auto',
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: theme.space.l,
          paddingBottom: theme.space.l,
          background: theme.colors.main.lightGray,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          py: 'var(--spacing-12)',
          justifySelf: 'center',
          maxWidth: '1440px',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: 'var(--line-height-100)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xs'],
          fontFamily: 'var(--font-face1-extended-bold)',
        },
      },
      baseRecommendationDesktopSliderWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-4)',
          width: '100%',
          px: 0,
        },
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...tabbedArrowStyles,
          left: '-30px',
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...tabbedArrowStyles,
          right: '-30px',
        },
      },
      fallbackMessageContainer: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mx: 0,
          px: 0,
          borderRadius: '10px',
          height: '323px',
          borderColor: 'var(--color-neutral-light-3)',
        },
      },
      fallbackMessage: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          mt: 0,

          '& strong': {
            ...theme.typography['text-display4-xs'],
            fontWeight: 700,
          },
        },
      },
      baseRecommendationSliderContainer: {
        '& .splide__slide': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            marginRight: 'var(--spacing-4)',
            width: 'calc((100% + var(--spacing-4)) / 4 - var(--spacing-4)) !important', // override inline styles from SplideSlider
          },
        },
      },
    }),
    tabbedPDP: ({ theme }) => ({
      baseRecommendationContentDivider: {
        '&.content-divider::before': {
          display: 'none',
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: theme.space.l,
          paddingBottom: theme.space.s10,
          background: 'unset',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: 'var(--line-height-100)',
        },
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: theme.space.s3,
        },
      },
    }),
    inlinePDPv6: ({ theme }) => ({
      baseRecommendationContentDivider: {
        '&.content-divider::before': {
          display: 'none',
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: theme.space.l,
          paddingBottom: theme.space.s10,
          background: 'unset',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 'var(--line-height-120)',
        },
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: theme.space.s3,
        },
      },
    }),
    goneViralRecommendation: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    goneViralRecommendationPLP: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
      baseRecommendationWrapper: {
        '&&': {
          backgroundColor: 'var(--color-neutral-light)',
          pt: '0',
          pb: '0',
        },
      },
    }),
    postATBMobile: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-6)',
          minHeight: 'unset',
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xxs'],
          fontFamily: 'var(--font-face1-extended-bold)',
        },
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-3)',
          gridGap: 'var(--spacing-3)',
        },
      },
    }),
    postAddToCartDrawer: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      baseRecommendationTitle: {
        marginBottom: 'var(--spacing-3)',
        ...theme.typography['text-display4-xxs'],
        fontFamily: 'var(--font-face1-extended-bold)',
        color: 'var(--color-black-base)',
        textAlign: 'left',
      },
      grid2Up: {
        flexWrap: 'wrap',
        gap: 'var(--spacing-3)',
      },
    }),
  },
}
