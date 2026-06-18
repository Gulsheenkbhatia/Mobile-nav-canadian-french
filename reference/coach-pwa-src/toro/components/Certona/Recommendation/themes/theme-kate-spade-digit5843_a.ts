export default {
  baseStyle: () => ({
    productNameWrapper: () => ({
      mt: 'var(--spacing-4)',
      mx: 0,
    }),
  }),
  variants: {
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      mainRecommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          minHeight: 'unset',
        },
      }),
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-l'],
          color: 'var(--color-black-base)',
          fontWeight: '500',
          '&.certona_title': {
            margin: '0 var(--spacing-3) 9px',
          },
        },
      }),
      mobileRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
        },
      },
      mobileRecommendationItems: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridGap: 'var(--spacing-2)',
          p: '0 var(--spacing-3)',
        },
      },
      contentDivider: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          minHeight: 'unset',
        },
      }),
      RecommendationItemWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          w: '130px',
        },
      }),
      RecommendationItem: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          h: 'auto',
          w: '130px',
          img: {
            h: 'inherit',
            w: '130px',
          },
        },
      }),
      productNameWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '8.5px 0 0',
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          textAlign: 'left',
        },
      },
      priceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'flex',
          justifyContent: 'left',
          flexWrap: 'wrap',
          gap: 'var(--spacing-2)',
        },
      }),
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
        },
      },
      recommendedPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
        },
      }),
    }),
    pdpV3RecommendationMobile: ({ theme }) => ({
      certonaTitle: () => ({
        ...theme.typography['text-display1-m'],
        fontSize: 'var(--text-24)',
        textAlign: 'left',
        color: 'var(--color-black-base)',
        paddingRight: theme.space.mar,
        lineHeight: 'var(--line-height-s)',
      }),
      mobileRecommendationWrapper: {
        mt: '10px',
      },
      contentDivider: () => ({
        m: '0 auto var(--spacing-8)',
        '&.content-divider::before': {
          display: 'none',
        },
      }),
      RecommendationItem: () => ({
        h: 'auto',
        w: '100%',
        img: {
          h: 'inherit',
          w: 'inherit',
        },
      }),
      RecommendationItemWrapper: () => ({
        mr: 0,
        width: '54.7vw',
      }),
      productName: {
        ...theme.typography['text-body1-l'],
        textAlign: 'left',
      },
      productNameWrapper: () => ({
        mx: 0,
        mt: '13px',
      }),
      recommendedPriceMainWrapper: {
        px: 0,
        '& .recommendation-tile-price-wrapper': {
          justifyContent: 'start',
          alignItems: 'center',
          pt: '3px',
        },
        '& .recommendation-price-comparable': {
          pt: 'var(--spacing-2)',
          pb: '1px',
        },
      },
      recommendedPriceText: (showSaleColor) => ({
        ...(showSaleColor ? theme.typography['text-body2-l'] : theme.typography['text-body2-m']),
        color: showSaleColor ? theme.colors.error.primary : theme.colors.main.black,
      }),
      mobileRecommendationItems: {
        overflowX: 'scroll',
        overflowY: 'hidden',
        gridGap: theme.space.s,
        pr: theme.space.mar,
      },
      recommendationWrapper: () => ({
        pt: '26px',
        pb: theme.space.xs,
        pl: theme.space.mar,
      }),
      comparablePriceWrapper: () => ({
        justifyContent: 'start',
        gridGap: theme.space.s1,
      }),
      comparablePrice: {
        ...theme.typography['text-body1-s'],
        color: theme.colors.main.black,
      },
      priceStrikeoff: {
        fontFamily: theme.fontFamily.primaryNormal,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.xl,
        letterSpacing: theme.letterSpacings.xs,
        color: '#696969',
        textDecoration: 'line-through',
      },
      priceDiscount: (showSaleColor) => ({
        ...theme.typography['text-body1-m'],
        color: showSaleColor ? '#E01' : '#696969',
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-m'],
          color: 'var(--color-black-base)',
          fontSize: 'var(--text-28)', // missing text-display1-ms
          textAlign: 'left',
          paddingRight: theme.space.mar,
        },
      }),
      mobileRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: theme.space.m,
        },
      },
      contentDivider: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: '0 auto var(--spacing-8)',
          '&.content-divider::before': {
            display: 'none',
          },
        },
      }),
      RecommendationItem: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          h: 'auto',
          w: '100%',
          img: {
            h: 'inherit',
            w: 'inherit',
          },
        },
      }),
      RecommendationItemWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 0,
          width: '54.7vw',
          maxWidth: 'fit-content',
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
        },
      },
      productNameWrapper: () => ({
        mt: 'var(--spacing-4)',
        mx: 0,
      }),
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 0,
          '&.recommended-price': {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'var(--spacing-2)',
          },
        },
      },
      recommendedPriceText: (showSaleColor) => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-m'],
          color: showSaleColor ? theme.colors.error.primary : theme.colors.main.black,
          textAlign: 'left',
        },
      }),
      mobileRecommendationItems: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          overflowX: 'scroll',
          gridGap: 'var(--spacing-2)',
          pr: theme.space.mar,
        },
      },
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: 'var(--spacing-6)',
          pb: 'var(--spacing-6)',
          pl: 'var(--spacing-3)',
        },
      }),
      comparablePrice: {
        ...theme.typography['text-body1-s'],
      },
      priceStrikeoff: {
        ...theme.typography['text-body1-m-line-through'],
        color: theme.colors.neutral.medium,
        textDecoration: 'line-through',
      },
      priceDiscount: (showSaleColor) => ({
        ...theme.typography['text-body1-m'],
        color: showSaleColor ? theme.colors.error.primary : theme.colors.neutral.medium,
      }),
    }),
    recommendationsStack: () => ({
      certonaTitle: () => ({ display: 'none' }),
      skeletonHorizontalBar: () => ({
        display: 'none',
      }),
      skeletonTitle: (isDesktop: boolean) => ({
        height: isDesktop ? '32px' : '34px',
        width: isDesktop ? '36%' : '72%',
        m: isDesktop ? '22px auto' : '16px auto',
      }),
      skeletonTilesWrapper: {
        my: '16px',
        mx: 0,
        px: 'var(--spacing-3)',
        minH: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        rowGap: 'var(--spacing-4)',
        width: '100%',
      },
      skeletonTileWrapper: {
        width: '100%',
        maxWidth: '100%',
        mr: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 'var(--spacing-3)',
      },
      skeletonTile: (isDesktop: boolean) => ({
        height: isDesktop ? '120px' : '96px',
        width: '132px',
        minWidth: '96px',
        maxWidth: '132px',
        flexShrink: 0,
      }),
      skeletonProductName: () => ({
        height: '40px',
        width: '100%',
        flex: 1,
        m: 0,
        mt: 0,
      }),
      mobileRecommendationWrapper: {
        maxWidth: '100%',
        width: '100%',
      },
      mobileRecommendationItems: {
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
        rowGap: 'var(--spacing-4)',
        overflowX: 'visible',
        overflowY: 'visible',
      },
      RecommendationItemWrapper: () => ({
        width: '100%',
        maxWidth: '100%',
        mr: 0,
      }),
      RecommendationItem: () => ({
        w: '100%',
        h: 'auto',
      }),
      contentDivider: () => ({
        '&.content-divider::before': {
          display: 'none',
        },
        m: 0,
        p: 0,
        minHeight: 'unset',
      }),
      mainRecommendationWrapper: () => ({
        minH: 'auto',
      }),
      recommendationWrapper: () => ({
        px: 0,
      }),
    }),
  },
}
