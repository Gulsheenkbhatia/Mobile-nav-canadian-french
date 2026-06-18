const certonaStyles = (theme) => ({
  certonaTitle: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: theme.fontSizes.xlg,
      lineHeight: theme.lineHeights.xs,
      letterSpacing: theme.letterSpacings.xs,
      color: theme.colors.main.primary,
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
    width: '209px',
    maxWidth: '209px',
    mr: theme.space.mar,
  }),
  productName: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontFamily: 'var(--font-face1-extended-bold)',
      textAlign: 'center',
      fontSize: theme.fontSizes.md,
      letterSpacing: theme.letterSpacings.xs,
      lineHeight: theme.lineHeights.lg,
    },
  },
  productNameWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mx: 0,
      mt: 'var(--spacing-3)',
    },
  }),
  recommendedPriceMainWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      px: 0,
      '&.recommended-price': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3px',
      },
    },
  },
  recommendedPriceText: (showSaleColor) => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      color: showSaleColor ? theme.colors.error.primary : theme.colors.main.black,
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: theme.fontSizes.md,
      lineHeight: theme.lineHeights.lg,
      letterSpacing: theme.letterSpacings.xs,
      textAlign: 'center',
    },
  }),
  mobileRecommendationItems: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      overflowX: 'scroll',
      gridGap: theme.space.s,
      pr: theme.space.mar,
    },
  },
  recommendationWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      pt: '26px',
      pb: theme.space.xs,
      pl: theme.space.mar,
    },
  }),
  comparablePrice: {
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.xs,
    letterSpacing: theme.letterSpacings.xs,
    lineHeight: theme.lineHeights.xl,
  },
  priceStrikeoff: {
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.sm,
    lineHeight: theme.lineHeights.xl,
    letterSpacing: theme.letterSpacings.xs,
    color: theme.colors.neutral.medium,
    textDecoration: 'line-through',
  },
  priceDiscount: (showSaleColor, isHomePage) => ({
    fontFamily: 'var(--font-face1-extended-normal)',
    lineHeight: theme.lineHeights.xl,
    fontSize: theme.fontSizes.sm,
    letterSpacing: theme.letterSpacings.xs,
    color: showSaleColor && !isHomePage ? theme.colors.error.primary : theme.colors.neutral.medium,
  }),
})

export default {
  variants: {
    pdpV3RecommendationMobile: ({ theme }) => ({
      ...certonaStyles(theme),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      ...certonaStyles(theme),
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      ...certonaStyles(theme),
      mobileRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '6px',
          pl: theme.space.mar,
        },
      },
      mainRecommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .certona_title': {
            pl: theme.space.mar,
            marginBottom: '0px',
          },
          mt: theme.space.s,
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
      RecommendationItemWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 0,
          width: '130px',
          maxWidth: 'fit-content',
        },
      }),
      contentDivider: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          minHeight: 'unset',
        },
      }),
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: theme.fontSizes.md,
          lineHeight: theme.lineHeights.s,
          letterSpacing: theme.letterSpacings.xs,
          color: theme.colors.main.primary,
          textAlign: 'left',
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'center',
          fontSize: theme.fontSizes.xs,
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: theme.lineHeights.xl,
        },
      },
      recommendedPriceText: (showSaleColor) => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: showSaleColor ? theme.colors.error.primary : theme.colors.main.black,
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
          letterSpacing: theme.letterSpacings.xs,
          textAlign: 'center',
        },
      }),
      productNameWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mx: 0,
          mt: '9px',
        },
      }),
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 0,
          '&.recommended-price': {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 0,
          },
        },
      },
      skeletonTile: () => ({
        height: '160px',
        width: '100%',
      }),
      skeletonProductName: () => ({
        height: '24px',
        width: '60%',
        mt: 'var(--spacing-3)',
      }),
      skeletonTitle: () => ({
        height: '23px',
        width: '60%',
        ml: 'var(--spacing-3)',
      }),
      skeletonTilesWrapper: {
        m: 'var(--spacing-2) var(--spacing-3) 0',
        minH: '160px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
      },
    }),
  },
}
