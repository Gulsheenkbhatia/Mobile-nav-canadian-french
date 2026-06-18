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
    'mobileRecommendationWrapper',
    'mobileRecommendationItems',
    'skeletonMobileMainWrapper',
    'skeletonBox',
    'skeletonTwoMobile',
    'skeletonDesktopMainWrapper',
    'skeletonTwoDesktop',
    'productWrapper',
    'recommendationWrapperMain',
    'mainRecoWrapperStyles',
    'einsteinTitle',
    'loadMoreProductButton',
    'recommendationGrid',
    'saveForLaterPosition',
    'skeletonTitle',
    'skeletonWrapper',
    'skeletonProductTile',
    'skeletonImage',
    'skeletonProductName',
  ],
  baseStyle: ({ theme }) => ({
    mainRecoWrapperStyles: (recommendationProductItems) => ({
      minHeight: recommendationProductItems?.length > 0 ? '260px' : '0',
    }),
    productLink: {
      textDecoration: theme.textDecorations.none,
    },
    productImageMainWrapper: (viewport) => ({
      mx: viewport !== 'mobile' && 1,
      position: 'relative',
    }),
    productImageWrapper: (isMobile) => ({
      bg: isMobile ? '' : '#EFEFEF',
    }),

    productImage: (isMobile) => ({
      objectFit: 'cover',
      height: isMobile ? '200px' : '270px',
      width: isMobile ? '160px' : '216px',
      maxWidth: '100%',
    }),
    productNameWrapper: (viewport) => ({
      mt: viewport === 'mobile' ? 'mar' : 'm',
      lineHeight: viewport !== 'mobile' ? '28px' : '',
    }),
    recommendedPriceTextWrapper: {
      width: '100%',
    },
    productWrapper: (isMobile) => ({
      width: isMobile ? '160px' : '224px',
      maxWidth: '100%',
      position: 'relative',
    }),
    productName: {
      textAlign: 'left',
      fontSize: 'md',
      fontFamily: theme.fontFamily.secondaryNormal,
      lineHeight: theme.lineHeights.xl,
      fontWeight: 'normal',
      color: theme.colors.main.black,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    recommendedPriceMainWrapper: {
      mx: 'xs',
      '@media (min-width: 769px)': {
        mt: 'mar',
      },
      '&.recommended-price': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.space.xl,
        marginLeft: theme.space.xl,
      },
    },
    recommendedPriceWrapper: {
      mr: 'mar',
    },
    recommendedPriceText: ({ comparablePriceOn, samePrice }) => ({
      color: comparablePriceOn && !samePrice ? theme.colors.main.saleRed : theme.colors.main.black,
      fontSize: theme.fontSizes.md,
      lineHeight: theme.lineHeights.xl,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
      textAlign: 'left',
    }),
    oldPriceWrapper: {
      mr: 'xs',
      width: '100%',
    },
    oldPriceText: {
      textDecoration: theme.textDecorations.lineThrough,
      color: theme.colors.neutral.dark,
      textAlign: 'left',
    },
    recommendationWrapper: (isDesktop) => ({
      py: isDesktop ? theme.space.xxl : theme.space.xl,
      borderTop: `${theme.borders['1px']} ${theme.colors.main.inactive}`,
      flexDirection: 'column',
      width: '100%',
    }),
    recommendationWrapperMain: (isDesktop) => ({
      minHeight: isDesktop ? '455px' : '316px',
      margin: '0 auto 32px',
    }),
    recommendationSliderWrapper: (carouselWidth, slideItems) => ({
      mx: 'auto',
      px: '24px',
      maxWidth: '100%',
      width: `${carouselWidth}px`,
      '& .splide__list': {
        justifyContent: slideItems <= 3 ? 'center' : 'none',
      },
      '& .splide__arrow svg': {
        outline: 'none',
      },
    }),

    mobileRecommendationWrapper: {
      mx: 'auto',
      px: '10px',
    },

    mobileRecommendationItems: {
      overflowX: 'scroll',
      gridGap: 1,
      '& [aria-label="wishlist"]': {
        left: 0,
      },
    },

    //SKELETON FOR PDP RECOMMENDATION

    skeletonMobileMainWrapper: {
      m: '42px',
    },
    skeletonBox: {
      mb: 'mar',
    },
    skeletonTwoMobile: {
      mb: '22px',
      mt: '22px',
    },
    skeletonDesktopMainWrapper: {
      m: '40px 10%',
    },
    skeletonTwoDesktop: {
      mr: '32px',
      ml: '32px',
      mt: '200px',
      mb: '40px',
    },
    einsteinTitle: {
      marginBottom: theme.space.xl,
      fontSize: theme.fontSizes.lg,
      fontFamily: theme.fontFamily.primaryBold,
      fontVariationSettings: 'var(--variation-1-bold)',
      fontWeight: theme.fontWeights?.bold,
      lineHeight: theme.lineHeights.s,
      letterSpacing: theme.letterSpacings.lg,
      color: theme.colors.black,
      textAlign: 'center',
      textTransform: 'capitalize',
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        fontSize: theme.fontSizes.xlg,
      },
    },
    skeletonTitle: {
      height: '23px',
      width: '60%',
      m: '22px auto',
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        height: 'var(--spacing-8)',
        width: '40%',
      },
    },
    skeletonWrapper: {
      m: '20px',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'end',
    },
    skeletonProductTile: {
      width: '40%',
      mr: '20px',
      display: 'flex',
      flexDirection: 'column',
      [`@media (min-width: ${theme.breakpoints.sm})`]: { width: '216px' },
    },
    skeletonImage: {
      height: '160px',
      width: '100%',
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        height: '270px',
      },
    },
    skeletonProductName: {
      height: '23px',
      width: '60%',
      m: '22px auto',
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        width: '100%',
      },
    },
  }),
  variants: {
    pdpV4EinsteinRecommendationMobile: ({ theme }) => ({
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderTop: 'none',
          flexDirection: 'column',
          padding: `${theme.space.xl} 0 40px`,
          width: '100%',
        },
      }),
      einsteinTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-m'],
          fontSize: theme.fontSizes.xl,
          lineHeight: theme.lineHeights.s,
          letterSpacing: theme.letterSpacings.sm,
          color: theme.colors.main.primary,
          textAlign: 'left',
          px: theme.space.mar,
          mb: theme.space.m,
        },
      },
      mobileRecommendationItems: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridGap: theme.space.s,
          padding: `0 ${theme.space.mar}`,
        },
      },
      mobileRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '0',
          padding: '0',
        },
      },
      productWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '53.3vw',
          position: 'relative',
        },
      }),
      productImageWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '53.3vw',
        },
      }),
      productImage: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'auto',
          aspectRatio: '4 / 5',
        },
      }),
      productNameWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: theme.space.m,
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
        },
      },
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: `${theme.space.mar} 0 0 !important`,
          justifyContent: 'left',
          gap: theme.space.mar,
        },
      },
      recommendedPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          color: theme.colors.main.black,
          fontSize: theme.fontSizes.sm,
          lineHeight: theme.lineHeights.xl,
          textAlign: 'left',
        },
      }),
      oldPriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          color: theme.colors.neutral.medium,
          fontSize: theme.fontSizes.sm,
          lineHeight: theme.lineHeights.xl,
          textAlign: 'left',
          width: 'max-content',
        },
      },
    }),
    pdpV4EinsteinRecommendationMobileGrid: ({ theme }) => ({
      mobileRecommendationItems: {
        gridGap: 'none',
        mb: 'var(--spacing-6)',
        width: '100%',
        padding: 'var(--spacing-3)',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      productWrapper: () => ({
        width: '100%',
        position: 'relative',
      }),
      productImageMainWrapper: () => ({
        position: 'relative',
        h: 'auto',
        w: '100%',
      }),
      productImageWrapper: () => ({
        h: 'auto',
        w: '100%',
        aspectRatio: '4/5',
      }),
      productImage: () => ({
        width: '100%',
        height: 'auto',
        aspectRatio: '4/5',
      }),
      productNameWrapper: () => ({
        marginTop: 'var(--spacing-2)',
        px: 'var(--spacing-2)',
      }),
      productName: {
        ...theme.typography['text-body1-m'],
      },
      recommendedPriceMainWrapper: {
        margin: 'var(--spacing-1) 0 0 !important',
        px: 'var(--spacing-2)',
        '&.recommended-price': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          gap: 'var(--spacing-2)',
        },
      },
      recommendedPriceTextWrapper: {
        width: 'fit-content',
      },
      recommendedPriceText: () => ({
        ...theme.typography['text-body1-m'],
      }),
      oldPriceWrapper: {
        width: 'fit-content',
      },
      oldPriceText: {
        ...theme.typography['text-body1-m'],
        color: theme.colors.neutral.medium,
      },
      recommendationWrapper: () => ({
        borderTop: 'none',
        flexDirection: 'column',
        padding: '0 0 var(--spacing-10)',
        width: '100%',
      }),
      loadMoreProductButton: {
        ...theme.typography['text-body1-l'],
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-white-base)',
        },
        color: 'var(--color-black-base)',
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--color-neutral-light-2)',
        h: 'auto',
        w: 'calc(100% - var(--spacing-6))',
        mx: 'auto',
        mb: '0',
        padding: '20px var(--spacing-6)',
        lineHeight: 'var(--line-height-xs)',
        borderRadius: 'var(--border-radius-full)',
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      recommendationWrapper: () => ({
        flexDirection: 'column',
        px: '20px',
        py: 'var(--spacing-4)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
        },
      }),
      productWrapper: () => ({
        position: 'relative',
      }),
      productImage: () => ({
        objectFit: 'cover',
        height: '282px',
        maxWidth: '100%',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: '#F0F0F0',
          height: '222px',
        },
      }),
      productImageMainWrapper: () => ({
        mx: 0,
        position: 'relative',
      }),
      einsteinTitle: {
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: 400,
        fontSize: 'var(--text-20) !important',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
        paddingBottom: 'var(--spacing-2)',
        marginBottom: 0,
        textAlign: 'left',
      },
      mobileRecommendationItems: {
        columnGap: 's1',
        rowGap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      productNameWrapper: () => ({
        marginTop: '9px',
      }),
      recommendationGrid: {
        columnGap: 's1',
        rowGap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      saveForLaterPosition: {
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
        right: '5px',
        top: '6px',
        button: {
          padding: '0',
        },
      },
      skeletonTitle: {
        m: '18px var(--spacing-2) 15px',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          height: 'var(--spacing-8)',
          m: '18px 20px 15px',
          width: '60%',
        },
      },
      skeletonWrapper: {
        m: 'var(--spacing-2)',
        gap: 'var(--spacing-1)',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          m: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0px, 1fr))',
          gap: 'var(--spacing-4) var(--spacing-1)',
        },
      },
      skeletonProductTile: {
        width: '100%',
        mr: '0px',
        [`@media (min-width: ${theme.breakpoints.sm})`]: { width: '100%' },
      },
      skeletonImage: {
        height: '222px',
        [`@media (min-width: ${theme.breakpoints.sm})`]: { height: '282px' },
      },
      skeletonProductName: {
        m: 'var(--spacing-3) 0px 0px',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          width: '60%',
        },
      },
    }),
  },
}
