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

const tabbedRecommendationVariant = (theme) => ({
  certonaTitle: () => ({ display: 'none' }),
  productName: {
    fontFamily: 'var(--font-face1-extended-bold)',
    fontSize: 'var(--text-12)',
    color: 'var(--color-primary)',
    lineHeight: 'var(--line-height-xl)',
    letterSpacing: 'var(--letter-spacing-xs)',
  },
  productNameWrapper: () => ({
    mt: 'var(--spacing-2)',
    mx: 0,
  }),

  recommendedPriceMainWrapper: {
    px: 0,
    '&.recommended-price': {
      marginTop: '5px',
    },
  },
  recommendedPriceText: () => ({
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: 'var(--text-12)',
    lineHeight: 'var(--line-height-xl)',
    letterSpacing: 'var(--letter-spacing-xs)',
  }),
  mobileRecommendationItems: {
    gridGap: 'var(--spacing-2)',
    pr: 'var(--spacing-3)',
    pl: 'var(--spacing-3)',
  },
  mobileRecommendationWrapper: {
    mt: 0,
  },
  RecommendationItem: () => ({
    height: '100%',
    width: '100%',
  }),
  RecommendationItemWrapper: () => ({
    mr: 0,
    width: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
    maxWidth: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
  }),
  priceContainer: () => ({
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  }),
  contentDivider: () => ({
    '&.content-divider::before': {
      display: 'none',
    },
    m: '0',
    p: '0',
  }),
  recommendationWrapper: () => ({
    pt: 'var(--spacing-3)',
    pl: '0px',
  }),
  mainRecommendationWrapper: () => ({
    minH: '100%',
  }),
  skeletonTitle: () => ({
    display: 'none',
  }),
  skeletonHorizontalBar: () => ({
    display: 'none',
  }),
  skeletonTilesWrapper: {
    m: '0',
    p: 'var(--spacing-3) 0 0 var(--spacing-3)',
    gap: 'var(--spacing-2)',
    justifyContent: 'start',
    overflowX: 'hidden',
  },
  skeletonTileWrapper: {
    width: 'auto',
    mr: '0',
    mt: '-1px',
  },
  skeletonTile: () => ({
    height: 'auto',
    aspectRatio: '4/5',
    width: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
    maxWidth: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
    borderRadius: 'var(--border-radius-none)',
  }),
  skeletonProductName: (_isDesktop, width) => ({
    height: '16.8px',
    width: width || '60%',
    mt: 'var(--spacing-2)',
    borderRadius: 'var(--border-radius-none)',
  }),
  priceStrikeoff: {
    ...theme.typography['text-body1-s'],
    fontFamily: 'var(--font-face1-extended-normal)',
  },
})

const aeDrawerStyles = (theme) => ({
  mobileRecommendationWrapper: {
    marginTop: 'var(--spacing-2)',
  },
  contentDivider: () => ({
    '&.content-divider::before': {
      display: 'none',
    },
    minHeight: 'auto',
    margin: '0',
  }),
  productImageWrapper: {
    mb: 'var(--spacing-2)',
  },
  productNameWrapper: () => ({
    p: 0,
  }),
  recommendationSliderWrapper: () => ({
    padding: '0 20px', // missing in the design token
    marginTop: 'var(--spacing-3)',
  }),
  mobileRecommendationItems: { gridGap: '0px' },
  arrowPrev: {
    ...arrowStyles,
    left: '-12px', // missing in the design token
  },
  arrowNext: {
    ...arrowStyles,
    right: '-12px', // missing in the design token
  },
  comparablePrice: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: theme.colors.main.black,
      fontSize: theme.fontSizes.xs,
    },
    ...theme.typography['text-body2-s'],
    fontFamily: 'var(--font-face1-extended-normal)',
    color: theme.colors.neutral.medium,
    fontSize: theme.fontSizes.sm,
  },
  recommendedPriceText: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: theme.fontSizes.md,
      letterSpacing: theme.letterSpacings.xs,
      lineHeight: theme.lineHeights.lg,
    },
    ...theme.typography['text-body2-xl'],
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.lg,
  }),
  priceDiscount: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: theme.fontSizes.sm,
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: '#057550',
    },
    ...theme.typography['text-body2-m'],
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.md,
  }),
  recommendedPriceMainWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mt: 'mar',
    },
    px: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'var(--spacing-2)',
    '&.recommended-price': {
      marginTop: 0,
    },
  },
})

const ITEMS_PER_SLIDE = 2.75

export default {
  parts: [
    'productLink',
    'productImageMainWrapper',
    'productImageWrapper',
    'productImage',
    'productNameWrapper',
    'productName',
    'recommendedPriceMainWrapper',
    'recommendedPriceWrapper',
    'recommendedPriceText',
    'oldPriceWrapper',
    'oldPriceText',
    'recommendationWrapper',
    'recommendationSliderWrapper',
    'recommendationFooter',
    'mobileRecommendationWrapper',
    'mobileRecommendationItems',
    'skeletonMobileMainWrapper',
    'skeletonBox',
    'skeletonTwoMobile',
    'skeletonDesktopMainWrapper',
    'skeletonTwoDesktop',
    'contentDivider',
    'arrowStyles',
    'RecommendationItem',
    'RecommendationItemWrapper',
    'certonaTitle',
    'arrowPrev',
    'arrowNext',
    'splidePadding',
    'skeletonProductName',
    'skeletonTile',
    'skeletonTitle',
    'skeletonTilesWrapper',
    'skeletonTileWrapper',
    'mainRecommendationWrapper',
    'skeletonHorizontalBar',
    'priceContainer',
    'priceStrikeoff',
    'priceDiscount',
    'comparablePriceWrapper',
    'comparablePrice',
    'saveForLaterPosition',
    'mobileRecommendationGrid',
    'loadMoreProductButton',
    'strikeOffWithDiscount',
    'addToBagButtonWrapper',
    'atbEnabledProductName',
    'addToBagStyles',
    'llmPromotion',
    'skeletonWrapper',
    'skeletonTileBox',
  ],
  baseStyle: ({ theme }) => ({
    productLink: {
      textDecoration: 'none',
    },
    productImageMainWrapper: () => ({
      mx: 0,
    }),
    productImageWrapper: {
      bg: '#F0F0F0',
    },
    productImage: {
      objectFit: 'cover',
    },
    productNameWrapper: (viewport) => ({
      mt: viewport === 'mobile' ? 'mar' : 'var(--spacing-3)',
      mx: 'var(--spacing-2)',
    }),
    productName: {
      textAlign: 'center',
      fontSize: 'var(--text-16)',
      fontFamily: 'var(--font-face1-extended-bold)',
      lineHeight: theme.lineHeights.xl,
      letterSpacing: 'var(--letter-spacing-xs)',
      color: theme.colors.main.black,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    recommendedPriceMainWrapper: {
      '@media (min-width: 769px)': {
        mt: 'mar',
      },
      px: 'var(--spacing-2)',
      '&.recommended-price': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'var(--spacing-2)',
      },
    },
    recommendedPriceWrapper: {
      mr: 'mar',
    },
    recommendedPriceText: (showSaleColor) => ({
      color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.black,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.xl,
      fontFamily: 'var(--font-face1-extended-normal)',
      letterSpacing: theme.letterSpacings.xs,
      textAlign: 'center',
    }),
    oldPriceWrapper: {
      mr: 'xs',
    },
    oldPriceText: {
      textDecoration: 'line-through',
      color: theme.colors.neutral.dark,
      textAlign: 'center',
    },
    recommendationWrapper: (isDesktop, hideYmalOnPDP) => ({
      '@media (max-width: 769px)': {
        pl: 'var(--spacing-3)',
      },
      py: isDesktop ? theme.space.xxl : theme.space.l,
      borderTop: !hideYmalOnPDP ? null : `${theme.borders['1px']} ${theme.colors.main.inactive}`,
    }),
    recommendationSliderWrapper: (carouselWidth) => ({
      mt: 'var(--spacing-8)',
      mx: 'auto',
      px: '24px',
      maxWidth: `${carouselWidth}px`,
    }),

    mobileRecommendationWrapper: {
      mt: 'var(--spacing-6)',
    },

    mobileRecommendationItems: {
      overflowX: 'scroll',
      gridGap: 1,
    },
    comparablePriceWrapper: () => ({
      '@media (max-width: 769px)': {
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: 0,
      },
      gap: theme.space.s1,
      justifyContent: 'center',
    }),
    comparablePrice: {
      color: theme.colors.neutral.medium,
      size: 'sm',
    },
    priceContainer: () => ({
      '@media (max-width: 769px)': {
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: 0,
      },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.space.s,
    }),
    priceStrikeoff: {
      fontSize: theme.fontSizes.sm,
      textDecoration: 'line-through',
      color: theme.colors.main.gray,
    },
    priceDiscount: (showSaleColor, isHomePage) => ({
      fontSize: theme.fontSizes.sm,
      color: showSaleColor && !isHomePage ? theme.colors.main.saleRed : theme.colors.main.gray,
    }),

    //SKELETON FOR PDP RECOMMENDATION

    skeletonTile: (isDesktop) => ({
      height: isDesktop ? '270px' : '176px',
      width: '100%',
    }),
    skeletonProductName: (isDesktop) => ({
      height: '40px',
      width: isDesktop ? '100%' : '80%',
      m: '22px 0px',
    }),
    skeletonProductPrice: (_isDesktop, width) => ({
      height: '16.8px',
      width: width || '60%',
      mt: '5px',
      borderRadius: 'var(--border-radius-none)',
    }),
    skeletonTitle: (isDesktop) => ({
      height: isDesktop ? '32px' : '34px',
      width: isDesktop ? '40%' : '60%',
      m: '22px 12px',
    }),
    skeletonTilesWrapper: {
      my: '24px',
      ml: '12px',
      minH: '200px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'end',
    },
    skeletonTileWrapper: {
      width: '40%',
      mr: '4px',
      display: 'flex',
      flexDirection: 'column',
    },
    skeletonHorizontalBar: () => ({
      display: 'none',
    }),
    mainRecommendationWrapper: () => ({
      minH: 'var(--certona-desktop-product-tile-height)',
    }),
    certonaTitle: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-30)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xs)',
        textAlign: 'start',
      },
      fontSize: 'var(--text-44)',
      fontFamily: 'var(--font-face1-extended-bold)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
    }),
    RecommendationItemWrapper: () => ({
      '@media (max-width: 769px)': {
        mr: 0,
        width: 'var(--certona-mobile-product-tile-dynamic-width)',
        maxWidth: 'var(--certona-mobile-product-tile-dynamic-width)',
      },
      width: '209px',
      maxWidth: '209px',
      mr: 'var(--spacing-3)',
    }),
    contentDivider: (isDesktop, atbDrawerRecommendationsLinkUrl) => ({
      minHeight: isDesktop ? '455px' : atbDrawerRecommendationsLinkUrl ? 'unset' : '316px',
      m: '0 auto 32px',
      p: '0',
    }),
    arrowStyles: () => ({
      transform: 'scale(2.5)',
      top: 'inherit',
      // 24px - half of arrow icon
      bottom: 'calc(100% - 24px - var(--certona-desktop-product-tile-height) / 2)',
      boxShadow: 'initial',
      '&:focus, & svg:focus': {
        outline: 'unset',
        outlineOffset: 'unset',
      },
    }),
    arrowPrev: {
      left: '-40px',
    },
    arrowNext: {
      right: '-61px',
    },
    RecommendationItem: (isMobile) => ({
      h: isMobile
        ? 'var(--certona-mobile-product-tile-height)'
        : 'var(--certona-desktop-product-tile-height)',
      w: '100%',
      img: {
        h: 'inherit',
        w: 'inherit',
      },
    }),
    splidePadding: {
      left: 'initial',
      right: 'initial',
    },
    saveForLaterPosition: {
      width: '24px',
      height: '24px',
      top: 'var(--spacing-2)',
      right: 'var(--spacing-2)',
    },
    addToBagButtonWrapper: {
      mt: 'var(--spacing-3)',
      mb: 'var(--spacing-3)',
    },
    atbEnabledProductName: {
      lineClamp: 1,
      WebkitLineClamp: 1,
    },
    llmPromotion: {
      color: 'var(--color-success-primary)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-xl)',
      my: 'var(--spacing-2)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-bold)',
      },
    },
  }),
  variants: {
    inlinegrid: ({ theme }) => ({
      productImageMainWrapper: () => ({
        mx: '0',
      }),
      productNameWrapper: (viewport) => ({
        mt: viewport === 'mobile' ? 'mar' : 'var(--spacing-3)',
        mx: 'var(--spacing-2)',
      }),
      recommendationWrapper: (isDesktop, hideYmalOnPDP) => ({
        py: '0',
        borderTop: !hideYmalOnPDP ? null : `${theme.borders['1px']} ${theme.colors.main.inactive}`,
      }),
      recommendationSliderWrapper: () => ({
        mx: 0,
        px: 0,
        maxWidth: undefined,
        mt: 'var(--spacing-4)',
      }),
      mobileRecommendationWrapper: {
        mt: 'var(--spacing-3)',
      },
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-26)',
        lineHeight: 'var(--line-height-xs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
        textAlign: 'left',
      }),
      RecommendationItemWrapper: (isMobile) => ({
        maxWidth: isMobile
          ? 'var(--certona-mobile-product-tile-dynamic-width)'
          : 'var(--certona-desktop-product-tile-width)',
      }),
      contentDivider: (isDesktop) => ({
        '&.content-divider::before': {
          display: 'none',
        },
        minHeight: isDesktop ? '215px' : '190px',
        m: '0',
        p: '24px 0',
        border: `${isDesktop ? '2px' : '1px'} solid var(--color-inactive)`,
        borderLeft: '0',
        borderRight: '0',
      }),
      arrowStyles: () => ({
        transform: 'scale(2.5)',
        top: 'inherit',
        // 24px - half of arrow icon
        bottom: 'calc(100% - 24px - var(--certona-desktop-product-tile-height) / 2)',
        boxShadow: 'var(--shadow-ltr)',
        '&:focus, & svg:focus': {
          outline: 'unset',
          outlineOffset: 'unset',
        },
      }),
      splidePadding: {
        left: '60',
        right: '60',
      },
      RecommendationItem: (isMobile) => ({
        h: isMobile ? 'auto' : 'var(--certona-desktop-product-tile-height)',
        w: isMobile
          ? 'var(--certona-mobile-product-tile-dynamic-width)'
          : 'var(--certona-desktop-product-tile-width)',
        img: {
          h: 'inherit',
          w: 'inherit',
        },
      }),
      arrowPrev: {
        left: '28px',
      },
      arrowNext: {
        right: 'var(--spacing-6)',
      },

      // Inline Grid skeleton
      skeletonTile: (isDesktop) => ({
        height: isDesktop ? '270px' : '163px',
        width: '100%',
      }),
      skeletonProductName: (isDesktop) => ({
        height: '23px',
        width: isDesktop ? '100%' : '60%',
        m: isDesktop ? '16px auto 0' : '12px auto 0',
      }),
      skeletonTitle: () => ({
        display: 'none',
      }),
      skeletonTilesWrapper: {
        m: '0',
        p: '24px 0',
        justifyContent: 'center',
      },
      mainRecommendationWrapper: (isDesktop) => ({
        '@media (max-width: 769px)': {
          pl: 'var(--spacing-3)',
        },
        minH: isDesktop ? '360px' : '248px',
      }),
      skeletonHorizontalBar: (isDesktop) => ({
        w: '100%',
        h: isDesktop ? '2px' : '1px',
      }),
      saveForLaterPosition: {
        top: 'var(--spacing-3)',
        right: 'var(--spacing-1)',
      },
    }),
    minicart: ({ theme }) => ({
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-20)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-s)',
      }),
      recommendationWrapper: () => ({
        pb: 'var(--spacing-4)',
      }),
      recommendationSliderWrapper: () => ({
        px: '0',
        mt: 'var(--spacing-2)',
      }),
      RecommendationItem: () => ({
        w: '100%',
        h: '100%',
      }),
      productNameWrapper: () => ({
        maxWidth: '124px',
        mt: 'var(--spacing-3)',
        mx: 'var(--spacing-2)',
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: theme.space.s,
        flexWrap: 'wrap',
        rowGap: 0,
      }),
      comparablePriceWrapper: () => ({
        gap: 'var(--spacing-1)',
        justifyContent: 'left',
        flexWrap: 'wrap',
        rowGap: 0,
      }),
      mainRecommendationWrapper: () => ({
        minH: 'auto',
        overflow: 'hidden',
      }),
      splidePadding: {
        left: '0',
        right: '0',
      },
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: '0',
        p: '0',
      }),
      arrowStyles: () => ({
        transform: 'scale(1.25)',
        top: 'inherit',
        // 89px it is half image height + half icon height
        bottom: 'calc(100% - 89px)',
        boxShadow: 'var(--shadow-ltrb)',
      }),
      arrowPrev: {
        left: '10px',
      },
      arrowNext: {
        right: '10px',
      },
      productImageMainWrapper: () => ({
        mx: 0,
      }),
      mobileRecommendationWrapper: {
        px: 'var(--spacing-3)',
      },
      RecommendationItemWrapper: () => ({
        maxWidth: '124px',
        mr: 'var(--spacing-1)',
      }),
      // Inline Grid skeleton
      skeletonTile: (isDesktop) => ({
        height: isDesktop ? '270px' : '163px',
        width: '100%',
      }),
      skeletonProductName: (isDesktop) => ({
        height: '23px',
        width: isDesktop ? '100%' : '60%',
        m: isDesktop ? '16px auto 0' : '12px auto 0',
      }),
      skeletonTitle: () => ({
        display: 'none',
      }),
      skeletonTilesWrapper: {
        m: '0',
        p: '24px 0',
        justifyContent: 'center',
      },
      skeletonHorizontalBar: (isDesktop) => ({
        w: '100%',
        h: isDesktop ? '2px' : '1px',
      }),
      saveForLaterPosition: {
        top: 'var(--spacing-2)',
        right: 'var(--spacing-2)',
      },
    }),
    atcRecommendationMobile: () => ({
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-20)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-s)',
        pt: 'var(--spacing-3)',
        pl: 'var(--spacing-3)',
      }),
      RecommendationItem: () => ({
        w: 'var(--certona-mobile-product-tile-dynamic-width)',
        h: 'auto',
      }),
      productNameWrapper: () => ({
        maxWidth: '124px',
        mt: 'var(--spacing-3)',
        mx: 'var(--spacing-2)',
      }),
      mainRecommendationWrapper: () => ({
        minH: 'auto',
        overflow: 'hidden',
        '& .certona_title': {
          marginBottom: '0px',
        },
        '& .btn-wishlist-container': {
          position: 'absolute',
          m: 0,
        },
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: '0',
        p: '0',
      }),
      mobileReccomendationWrapper: {
        pl: 'var(--spacing-3)',
      },
      RecommendationItemWrapper: () => ({
        maxWidth: 'var(--certona-mobile-product-tile-dynamic-width)',
      }),
      saveForLaterPosition: {
        top: 'var(--spacing-2)',
        right: 'var(--spacing-4)',
      },
    }),

    similarProductRecommendationAdaptivePDP: () => ({
      contentDivider: () => ({
        m: '0',
      }),
      RecommendationItemWrapper: () => ({
        width: '100%',
      }),
      RecommendationItem: () => ({
        h: 'auto',
        w: '100%',
      }),
      productNameWrapper: () => ({
        mt: 'var(--spacing-2)',
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-14)',
        px: 'var(--spacing-2)',
      },
      loadMoreProductButton: {
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-white-base)',
        },
        color: 'var(--color-primary)',
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--border-color-inactive)',
        h: 'auto',
        w: 'calc(100% - var(--spacing-6))',
        mx: 'auto',
        padding: '20px var(--spacing-6)',
        mb: 'var(--spacing-12)',
        lineHeight: 'var(--line-height-xs)',
        borderRadius: 'var(--border-radius-s)',
      },
      mobileRecommendationGrid: {
        columnGap: 'none',
        rowGap: 'none',
        mb: '27px',
        width: '100%',
        padding: 'var(--spacing-3)',

        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      recommendationWrapper: () => ({
        pl: '0',
      }),
      recommendedPriceMainWrapper: {
        px: 'var(--spacing-2)',
        '&.recommended-price': {
          marginTop: '7px',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
    }),
    similarProductRecommendation: () => ({
      contentDivider: () => ({
        m: '0',
      }),
      RecommendationItemWrapper: () => ({
        width: '100%',
      }),
      RecommendationItem: () => ({
        h: 'auto',
        w: '100%',
      }),
      productNameWrapper: () => ({
        mt: 'var(--spacing-2)',
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-14)',
        px: 'var(--spacing-2)',
      },
      loadMoreProductButton: {
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-white-base)',
        },
        color: 'var(--color-primary)',
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--border-color-inactive)',
        h: 'auto',
        w: 'calc(100% - var(--spacing-6))',
        mx: 'auto',
        padding: '20px var(--spacing-6)',
        mb: 'var(--spacing-12)',
        lineHeight: 'var(--line-height-xs)',
        borderRadius: 'var(--border-radius-s)',
      },
      mobileRecommendationGrid: {
        columnGap: 's1',
        rowGap: '19px',
        mb: '27px',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      recommendationWrapper: () => ({
        pl: '0',
      }),
      recommendedPriceMainWrapper: {
        px: 'var(--spacing-2)',
        '&.recommended-price': {
          marginTop: '7px',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
    }),

    aeDrawer: ({ theme }) => ({
      ...aeDrawerStyles(theme),
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: 0,
        },
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: '0.2px',
        textAlign: 'left',
        paddingLeft: '20px',
      }),
      RecommendationItemWrapper: () => ({
        width: '148px',
        marginRight: 'var(--spacing-1)',
      }),
      RecommendationItem: () => ({
        height: '185px',
      }),
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          paddingLeft: 'var(--spacing-2)',
        },
        paddingTop: '13px',
        paddingLeft: 0,
        paddingBottom: 'var(--spacing-3)',
        '.btn-wishlist-container-recommend': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          button: {
            padding: '0',
          },
        },
      }),
      productNameWrapper: () => ({
        marginTop: '11px',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: '3px',
        },
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          textAlign: 'center',
          marginTop: 'var(--spacing-2)',
        },
      },
      comparablePriceWrapper: () => ({
        justifyContent: 'left',
        flexWrap: 'wrap',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'center',
        },
        columnGap: 'var(--spacing-1)',
      }),
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-neutral-medium)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textAlign: 'center',
          color: 'var(--color-neutral-1)',
        },
      },
      priceContainer: () => ({
        display: 'flex',
        columnGap: '6px',
        alignItems: 'center',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'center',
        },
      }),
      recommendedPriceText: () => ({
        '@media (max-width: 544px)': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: 'var(--line-height-140)',
          fontStyle: 'normal',
        },
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          color: 'var(--color-neutral-1)',
        },
      },
      priceDiscount: () => ({
        '@media (max-width: 544px)': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-xl)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: '#057550',
        },
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: theme.fontSizes.md,
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-neutral-medium)',
      }),
      recommendedPriceMainWrapper: {
        px: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&.recommended-price': {
          marginTop: '0px',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            marginTop: '3px',
          },
        },
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      ...aeDrawerStyles(theme),
      mobileRecommendationGrid: {
        columnGap: 's1',
        rowGap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      RecommendationItemWrapper: () => ({
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }),
      addToBagButtonWrapper: {
        mt: 'auto',
        paddingTop: 'var(--spacing-3)',
      },
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
        },
        px: '20px', // missing in the design token
        py: 'var(--spacing-4)',
      }),
      RecommendationItem: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          height: '222px',
        },
        height: '282px',
      }),
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        paddingBottom: '10px', // missing in the design token
      }),
      saveForLaterPosition: {
        right: '5px',
        top: '6px',
        button: {
          padding: '0',
        },
      },
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'mar',
        },
        px: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'var(--spacing-2)',
        '&.recommended-price': {
          marginTop: 0,
          alignItems: 'start',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
      priceDiscount: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: theme.fontSizes.md,
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-neutral-medium)',
      }),
      llmPromotion: {
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face2-normal)',
          fontSize: 'var(--text-14)',
        },
      },
      recommendationFooter: {
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
    aeDrawerGridSocial: ({ theme }) => ({
      ...aeDrawerStyles(theme),
      mobileRecommendationGrid: {
        columnGap: 's1',
        rowGap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      RecommendationItemWrapper: () => ({
        width: '100%',
        maxWidth: '100%',
      }),
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
        },
        px: '20px', // missing in the design token
        py: 'var(--spacing-4)',
      }),
      RecommendationItem: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          height: '222px',
        },
        height: '282px',
      }),
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        paddingBottom: '10px', // missing in the design token
      }),
      productLink: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      productImageMainWrapper: () => ({
        width: '100%',
        aspectRatio: '1 / 1.25',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
      productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
      productNameWrapper: () => ({
        mt: 'var(--spacing-2)',
        textAlign: 'center',
        minHeight: '40px',
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-s)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        minWidth: 0,
      },
      addToBagButtonWrapper: {
        mt: 'var(--spacing-2)',
      },
      saveForLaterPosition: {
        right: '5px',
        top: '6px',
        button: {
          padding: '0',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
      priceDiscount: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: theme.fontSizes.md,
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-neutral-medium)',
      }),
      llmPromotion: {
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face2-normal)',
          fontSize: 'var(--text-14)',
        },
      },
    }),
    inlinegridV3: ({ theme }) => ({
      comparablePriceWrapper: () => ({
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 'var(--spacing-1)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'left',
          rowGap: 0,
        },
      }),
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-28)',
        lineHeight: 'var(--line-height-xs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-primary)',
        textAlign: 'center',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-44)',
          color: 'var(--color-black-base)',
          marginBottom: '46px',
        },
      }),
      mobileRecommendationItems: {
        gridGap: 'var(--spacing-2)',
        pr: 'var(--spacing-3)',
      },
      productNameWrapper: () => ({
        mt: '9px',
      }),
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xl)',
        color: 'var(--color-primary)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textAlign: 'center',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          fontFamily: 'var(--font-face1-extended-bold)',
          color: 'var(--color-black-base)',
          marginBottom: '6px',
          marginTop: '13px',
        },
      },
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'var(--spacing-1)',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xl)',
        textAlign: 'left',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      }),
      priceDiscount: () => ({
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: '#057550',
      }),
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.space.xs,
      }),
      recommendationWrapper: () => ({
        pt: '28px',
        pb: '35px',
        pl: 'var(--spacing-3)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pl: 0,
        },
      }),
      mainRecommendationWrapper: () => ({
        minH: 'var(--certona-desktop-product-tile-height)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mx: 'var(--spacing-6)',
          '.content-divider': {
            border: 'none',
          },
          '& .splide__slide': {
            width: 'calc(25% - 12px)',
          },
          '& .splide__arrow': {
            width: '56px',
            height: '56px',
            boxShadow: '0px 7px 16px rgba(0,0,0,0.05)',
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
        },
      }),
      arrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          transform: 'none',
          left: '-24px',
        },
      },
      arrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          transform: 'none',
          right: '-24px',
        },
      },
      mobileRecommendationWrapper: {
        mt: '10px',
        '& div:has(.recommendation-price-comparable) .recommended-price > div': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '56px',

          '& .recommendation-tile-price-wrapper': {
            marginTop: 'auto',
          },
        },
      },
      RecommendationItemWrapper: () => ({
        maxWidth: 'calc((100vw - 28px) / 2.66)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '228px',
          margin: 'auto',
        },
      }),
      recommendationSliderWrapper: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mx: 0,
          px: 0,
          '& div:has(.recommendation-price-comparable) .recommended-price > div': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '40px',

            '& .recommendation-tile-price-wrapper': {
              marginTop: 'auto',
            },
          },
        },
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        border: '1px solid var(--color-inactive)',
        borderLeft: '0',
        borderRight: '0',
      }),
      RecommendationItem: () => ({
        h: 'auto',
        w: 'calc((100vw - 28px) / 2.66)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '228px',
        },
        img: {
          h: 'inherit',
          w: 'inherit',
          objectFit: 'contain',
        },
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textDecoration: 'line-through',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-medium)',
        },
      },
    }),
    RVRecommendationsItem: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'var(--spacing-1)',
          mr: '0px !important',
          p: '0 var(--spacing-2)',
        },
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        '&:not(:has(.strike-off-price)) span': {
          margin: '0 auto',
        },
      }),
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        ...theme.typography['text-body1-s'],
        fontWeight: 700,
      }),
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
        textDecoration: 'line-through',
        ml: '6px',
      },
    }),
    DesktopCollapsibleRVItem: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          mt: '6px',
        },
        '& .recommendation-tile-price-wrapper': {
          gap: 'var(--spacing-1)',
          display: 'flex',
          justifyContent: 'center',
          '& span': {
            ...theme.typography['text-title1-xs'],
            marginTop: '3px',
          },
        },
      },
    }),
    DesktopCollapsibleRVItemPLP: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          mt: '6px',
        },
        '& .recommendation-tile-price-wrapper': {
          gap: 'var(--spacing-1)',
          display: 'flex',
          justifyContent: 'center',
          '& span': {
            ...theme.typography['text-title1-xs'],
            marginTop: '3px',
            color: 'var(--color-neutral-dark-1)',
          },
        },
      },
    }),
    tabbedRecommendation: ({ theme }) => ({
      ...tabbedRecommendationVariant(theme),
      addToBagButtonWrapper: {
        mt: 'var(--spacing-3)',
        mb: 'var(--spacing-1)',
      },
    }),
    tabbedPDPRecommendation: ({ theme }) => ({
      ...tabbedRecommendationVariant(theme),
      recommendedPriceText: () => ({
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-extended-normal)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
    }),
    LLMRecommendation: ({ theme }) => ({
      productName: {
        ...theme.typography['text-body1-l'],
        fontFamily: 'var(--font-face1-extended-bold)',
      },
      productNameWrapper: () => ({
        pt: 'var(--spacing-3)',
        mx: 0,
      }),
      RecommendationItemWrapper: () => ({
        mr: 0,
        width: '54.7vw',
        maxWidth: 'fit-content',
        minWidth: '54.7vw',
      }),
      RecommendationItem: () => ({
        height: 'auto',
        width: '100%',
      }),
    }),
    EnhancedPDPRecommendation: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto',
          padding: '2px 0 0 0',
        },
      },
      recommendedPriceText: () => ({
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xl)',
        textAlign: 'left',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: '#057550',
      }),
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: theme.space.xs,
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textDecoration: 'line-through',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-1)',
          height: '14px',
          mt: 'var(--spacing-1)',
          mb: 'var(--spacing-1)',
        },
      },
      skeletonTitle: () => ({
        height: '34px',
        width: '60%',
        m: 0,
        ml: 'var(--spacing-4)',
      }),
      skeletonTilesWrapper: {
        m: '0',
        p: 'var(--spacing-3) 0 0 var(--spacing-3)',
        gap: 'var(--spacing-2)',
        justifyContent: 'start',
        overflowX: 'hidden',
        alignItems: 'start',

        '& > div:nth-child(2)': {
          aspectRatio: '1/1',
          maxWidth: '35vw',
          minWidth: '35vw',
          height: '100%',
          width: '100%',
        },
        '& > div:nth-child(2) > div': {
          maxWidth: '100%',
          minWidth: '100%',
        },
      },
      skeletonTileWrapper: {
        width: 'fit-content',
        m: 0,
        padding: '0',
        height: '100%',
        flexDirection: 'column',
        display: 'flex',
      },
      skeletonTile: () => ({
        padding: '0',
        aspectRatio: '2/3',
        maxWidth: '51vw',
        minWidth: '51vw',
        height: '100%',
      }),
      skeletonProductName: () => ({
        height: '40px',
        width: '80%',
        m: 0,
        mt: 'var(--spacing-2)',
      }),
    }),
    BecauseYouViewedPDPRecommendation: ({ theme }) => ({
      RecommendationItemWrapper: () => ({
        width: '100%',
        minWidth: '35vw',
        maxWidth: '35vw',
      }),
      certonaTitle: () => ({
        display: 'none',
      }),
      mobileRecommendationWrapper: {
        mt: 0,
      },
      recommendationWrapper: () => ({
        pt: 0,
        pl: 'var(--spacing-3)',
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: '0',
        p: '0',
      }),
      mainRecommendationWrapper: () => ({
        minH: '100%',
      }),
      mobileRecommendationItems: {
        gridGap: 'var(--spacing-2)',
      },
      productLink: {
        width: 'inherit',
        height: 'auto',
      },
      productImageWrapper: {
        aspectRatio: '4 / 5',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      productImage: {
        height: 'auto',
        width: '100%',

        '& img': {
          width: 'inherit',
          height: 'inherit',
        },
      },
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        mt: 'var(--spacing-2)',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      productNameWrapper: () => ({
        margin: '0px',
      }),
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto',
          padding: 'var(--spacing-2) 0 0 0',
        },
      },
      recommendedPriceText: () => ({
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xl)',
        textAlign: 'left',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: '#057550',
      }),
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: theme.space.xs,
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textDecoration: 'line-through',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-10)',
        textTransform: 'none',
        color: 'var(--color-neutral-1)',
        height: '14px',
      },
      skeletonTilesWrapper: {
        m: '0',
        pl: 'var(--spacing-3)',
        gap: 'var(--spacing-3)',
        justifyContent: 'start',
        overflowX: 'hidden',
      },
      skeletonTileWrapper: {
        mr: '0',
        width: '100%',
        minWidth: '35vw',
        maxWidth: '35vw',
        aspectRatio: '4 / 5',
      },
      skeletonTitle: () => ({
        display: 'none',
      }),
      skeletonProductName: () => ({
        height: '40px',
        width: '80%',
        m: '0',
        mt: 'var(--spacing-2)',
      }),
    }),
    goneViralRecommendation: ({ theme }) => ({
      ...tabbedRecommendationVariant(theme),
      recommendationWrapper: () => ({
        pt: 'var(--spacing-4)',
        pl: 'var(--spacing-4)',
      }),
      recommendedPriceText: () => ({
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-extended-normal)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
      }),
      mobileRecommendationItems: {
        gridGap: '10px',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-10)',
          color: 'var(--color-neutral-1)',
        },
      },
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-success-primary)',
      }),
    }),
    becauseYouViewedPLPV2: ({ theme }) => ({
      RecommendationItemWrapper: () => ({
        width: '100%',
        minWidth: '24.7vw',
        maxWidth: '24.7vw',
      }),
      certonaTitle: () => ({
        display: 'none',
      }),
      mobileRecommendationWrapper: {
        mt: 0,
        maxWidth: 'unset',
      },
      recommendationWrapper: () => ({
        paddingTop: 'var(--spacing-4)',
        pl: 'var(--spacing-4)',
        pr: 'var(--spacing-4)',
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: '0',
        p: '0',
      }),
      mainRecommendationWrapper: () => ({
        minH: '100%',
      }),
      mobileRecommendationItems: {
        gridGap: 'var(--spacing-2)',
        overflow: 'unset',
        maxWidth: 'unset',
      },
      productLink: {
        width: 'inherit',
        height: 'auto',
      },
      productImageWrapper: {
        aspectRatio: '4 / 5',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      productImage: {
        height: 'auto',
        width: '100%',

        '& img': {
          width: 'inherit',
          height: 'inherit',
        },
      },
      productName: {
        fontFamily: 'var(--font-face1-extended-bold)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        mt: 'var(--spacing-2)',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      productNameWrapper: () => ({
        display: 'none',
      }),
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto',
          padding: 'var(--spacing-1) 0 0 0',
        },
      },
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: '#057550',
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textDecoration: 'line-through',
        ml: '6px',
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.space.xs,
      }),
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-10)',
        textTransform: 'none',
        color: 'var(--color-neutral-1)',
        height: '14px',
      },
      skeletonTilesWrapper: {
        m: '0',
        pl: 'var(--spacing-3)',
        gap: 'var(--spacing-3)',
        justifyContent: 'start',
        overflowX: 'hidden',
      },
      skeletonTileWrapper: {
        mr: '0',
        width: '100%',
        minWidth: '24.7vw',
        maxWidth: '24.7vw',
        aspectRatio: '4 / 5',
      },
      skeletonTitle: () => ({
        display: 'none',
      }),
      skeletonProductName: () => ({
        height: '40px',
        width: '80%',
        m: '0',
        mt: 'var(--spacing-2)',
      }),
      RecommendationItem: () => ({
        height: '100%',
        width: '100%',
      }),
    }),
    enchncedATBRecommendationMobile: ({ theme }) => ({
      mobileRecommendationWrapper: {
        mt: 0,
        maxWidth: 'unset',
      },
      mainRecommendationWrapper: () => ({
        minH: 0,
        mb: 'var(--spacing-6)',
      }),
      RecommendationItem: () => ({
        h: '208px',
        w: '100%',
        img: {
          h: 'inherit',
          w: 'inherit',
        },
      }),
      mobileRecommendationItems: {
        gridGap: 'var(--spacing-2)',
        '& .btn-wishlist-container-recommend': {
          display: 'none',
        },
      },
      productNameWrapper: () => ({
        mt: 'var(--spacing-2)',
      }),
      productName: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      recommendedPriceMainWrapper: {
        p: 0,
        '&.recommended-price': {
          marginTop: '3px',
        },
      },
      recommendedPriceText: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      }),
      certonaTitle: () => ({ display: 'none' }),
    }),
    loveAtFirstSwipe: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        padding: 0,
        '&.recommended-price': {
          marginTop: 'var(--spacing-1)',
        },
      },
      priceContainer: () => ({
        display: 'flex',
        gap: 'var(--spacing-1)',
      }),
      recommendedPriceText: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        lineHeight: 'unset',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-success-primary)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      strikeOffWithDiscount: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      comparablePrice: {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
      },
    }),
    lookbookPDP: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        padding: 0,
        '&.recommended-price': {
          marginTop: 0,
        },
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--spacing-1)',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-success-primary)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      strikeOffWithDiscount: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      comparablePrice: {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
        '@media (max-width: 544px)': {
          color: 'var(--color-neutral-1)',
        },
      },
      comparablePriceWrapper: () => ({
        justifyContent: 'center',
        gap: 'var(--spacing-1)',
        color: 'var(--color-neutral-1)',
        marginBottom: 'var(--spacing-2)',
      }),
      recommendedPriceText: () => ({
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
      }),
    }),
    viewSimilarProductsPDP: () => ({
      RecommendationItemWrapper: () => ({
        width: '39vw',
      }),
      mobileRecommendationWrapper: {
        margin: 0,
      },
      mobileRecommendationItems: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '4px',
        justifyContent: 'center',
        padding: 0,
        '& .btn-wishlist-container-recommend': {
          display: 'none',
        },
      },
      RecommendationItem: () => ({
        height: 'auto',
        aspectRatio: '17 / 12',
        borderRadius: 'var(--border-radius-m)',
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        },
        '& .product-image': {
          borderRadius: 'var(--border-radius-m)',
          border: '1px solid var(--color-neutral-light-2)',
        },
      }),
      recommendationContainer: {
        padding: 0,
      },
      recommendationWrapper: () => ({
        padding: 0,
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: '0',
        p: '0',
      }),
      mainRecommendationWrapper: () => ({
        minHeight: 'auto',
      }),
    }),
    postAddToCartDrawer: () => ({
      skeletonWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
      },
      skeletonTilesWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-3)',
        margin: 0,
      },
      skeletonTitle: () => ({
        width: '200px',
        height: '19px',
      }),
      skeletonTileBox: {
        width: '192px',
        margin: '0',
      },
      skeletonTile: () => ({
        height: '192px',
        marginBottom: 'var(--spacing-3)',
      }),
      skeletonProductName: () => ({
        height: '37px',
      }),
    }),
    BecauseYouViewedPdp: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        textAlign: 'center',
        w: '100%',
      },
      comparablePriceWrapper: () => ({
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--spacing-1)',
        marginBottom: 'var(--spacing-1)',
      }),
      comparablePrice: {
        ...theme.typography['text-title1-s'],
        color: 'var(--color-neutral-1)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'center',
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
      }),
      recommendedPriceText: () => ({
        ...theme.typography['text-title1-s'],
        color: 'var(--color-black-base)',
        textAlign: 'center',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-title1-s'],
        color: 'var(--color-success-primary)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-title1-s'],
        color: 'var(--color-neutral-1)',
        textDecoration: 'line-through',
      },
    }),
  },
}
