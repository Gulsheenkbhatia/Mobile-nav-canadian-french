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
    'clickToShop',
    'clickToShopbtn',
    'recommendationMobileSliderWrapper',
    'atbEnabledProductName',
  ],
  baseStyle: ({ theme }) => ({
    productLink: {
      textDecoration: 'none',
    },
    clickToShopLink: {
      textDecoration: 'none',
      _hover: {
        textDecoration: 'none',
      },
    },
    clickToShopbtnContainer: {
      '@media (max-width: 769px)': {
        justifyContent: 'start',
        mx: 'var(--spacing-2)',
      },
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'var(--spacing-3)',
    },
    clickToShopbtn: {
      backgroundColor: theme.colors.main.secondary,
      color: theme.colors.main.black,
      borderRadius: 'var(--border-radius-xs)',
      borderColor: 'var(--color-primary)',
      border: '1px',
      maxWidth: '100%',
      height: '100%',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-10)',
      letterSpacing: 'var(--letter-spacing-xl)',
      lineHeight: 'var(--line-height-xs)',
      padding: 'var(--spacing-2)',
      _hover: {
        backgroundColor: `${theme.colors.main.secondary} !important`,
      },
      _active: {
        backgroundColor: theme.colors.main.secondary,
      },
    },
    productImageMainWrapper: () => ({}),
    productImageWrapper: (viewport) => ({
      bg: viewport === 'mobile' ? '' : '#EFEFEF',
    }),
    productImage: {
      objectFit: 'cover',
    },
    productNameWrapper: (viewport) => ({
      mt: viewport === 'mobile' ? 'mar' : 'var(--spacing-3)',
      mx: 'var(--spacing-2)',
      lineHeight: viewport !== 'mobile' ? '28px' : '',
    }),
    productName: {
      textAlign: 'center',
      fontSize: 'var(--text-16)',
      fontFamily: 'var(--font-face1-extended-bold)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: theme.lineHeights.xl,
      color: theme.colors.main.black,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      display: '-webkit-box',
      lineClamp: 1,
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    },
    recommendedPriceMainWrapper: {
      mx: 'xs',
      '@media (min-width: 769px)': {
        mt: 'mar',
      },
      '&.recommended-price': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '8px',
        width: '100%',
        '& > *': {
          marginLeft: '4px',
          marginRight: '4px',
        },
        '&:first-of-type': {
          marginLeft: '0',
        },
        '&:last-of-type': {
          marginRight: '0',
        },
      },
    },
    recommendedPriceWrapper: {
      mr: 'mar',
    },
    recommendedPriceText: (comparablePriceOn) => ({
      color: comparablePriceOn ? theme.colors.main.saleRed : theme.colors.main.black,
      fontSize: 'var(--text-20)',
      lineHeight: theme.lineHeights.xl,
      fontFamily: 'var(--font-face1-extended-normal)',
      textAlign: 'center',
    }),
    oldPriceWrapper: {
      mx: 's',
    },
    oldPriceText: {
      textDecoration: 'line-through',
      color: theme.colors.neutral.dark,
      textAlign: 'center',
      fontSize: 'var(--text-20)',
    },
    recommendationWrapper: (isDesktop, hideYmalOnPDP) => ({
      '@media (max-width: 769px)': {
        pl: 'var(--spacing-3)',
      },
      py: isDesktop ? theme.space.xxl : theme.space.xl,
      borderTop: !hideYmalOnPDP ? null : `${theme.borders['1px']} ${theme.colors.main.inactive}`,
    }),
    recommendationSliderWrapper: {
      mx: 'auto',
      px: '24px',
      '& .leftArrowStyle': {
        transform: 'none',
        left: '-58px',
        top: 'inherit',
        // 24px - half of arrow icon
        bottom: 'calc(100% - 24px - var(--certona-desktop-product-tile-height) / 2)',
      },
      '& .rightArrowStyle': {
        transform: 'none',
        right: '-60px',
        top: 'inherit',
        // 24px - half of arrow icon
        bottom: 'calc(100% - 24px - var(--certona-desktop-product-tile-height) / 2)',
      },
    },

    recommendationMobileSliderWrapper: {
      mt: 'var(--spacing-6)',
    },

    mobileRecommendationWrapper: {
      mx: 'auto',
      px: '10px',
    },

    mobileRecommendationItems: {
      overflowX: 'scroll',
      gridGap: 1,
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
    certonaTitleHome: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-30)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xs)',
        textAlign: 'start',
      },
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-44)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
    }),
    certonaSubTitle: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-16)',
      },
      fontSize: 'var(--text-20)',
      textAlign: 'center',
      fontFamily: 'var(--font-face1-extended-normal)',
      marginBottom: 'var(--text-32)',
    }),
    mobileImageContainer: {
      '@media (max-width: 769px)': {
        margin: 0,
      },
      margin: '0 6px',
    },
    addToBagButtonWrapper: {
      marginTop: 'var(--spacing-3)',
    },
    atbEnabledProductName: {
      lineClamp: 1,
      WebkitLineClamp: 1,
    },
  }),
}
