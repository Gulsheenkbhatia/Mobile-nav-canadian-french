const recommendationItemStyles = {
  h: 'auto',
  w: '100%',
  img: {
    h: 'inherit',
    w: 'inherit',
  },
}

const recommendationItemWrapperStyles = {
  mr: 0,
  width: '54.7vw',
  maxWidth: 'fit-content',
}

const recommendedPriceTextStyles = (theme, showSaleColor = false) => ({
  color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.black,
  fontFamily: 'var(--font-face1-extended-normal)',
  fontSize: theme.fontSizes.md,
  lineHeight: theme.lineHeights.xl,
  letterSpacing: theme.letterSpacings.xs,
  textAlign: 'center',
})

const mobileRecommendationItemsStyles = (theme) => ({
  overflowX: 'scroll',
  gridGap: 2,
  p: '0 var(--spacing-3)',
})

const recommendedPriceMainWrapperStyles = (theme) => ({
  px: 0,
  '&.recommended-price': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.space.mar,
  },
})

const productNameWrapperStyles = (theme) => ({
  mx: 0,
  mt: theme.space.m,
})

const mobileRecommendationWrapperStyles = (theme) => ({
  mt: theme.space.m,
})

const commonCertonaTitleStyles = (theme) => ({
  fontFamily: 'var(--font-face1-extended-bold)',
  fontSize: theme.fontSizes.xl,
  lineHeight: theme.lineHeights.s,
  letterSpacing: theme.letterSpacings.sm,
  color: theme.colors.main.primary,
  textAlign: 'left',
  paddingLeft: theme.space.mar,
})

const certonaStyles = (theme) => ({
  certonaTitle: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...commonCertonaTitleStyles(theme),
    },
  }),
  mobileRecommendationWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...mobileRecommendationWrapperStyles(theme),
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
      ...recommendationItemStyles,
    },
  }),
  RecommendationItemWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...recommendationItemWrapperStyles,
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
      lineHeight: theme.lineHeights.xl,
    },
  },
  productNameWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...productNameWrapperStyles(theme),
    },
  }),
  recommendedPriceMainWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...recommendedPriceMainWrapperStyles(theme),
    },
  },
  recommendedPriceText: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...recommendedPriceTextStyles(theme),
    },
  }),
  mobileRecommendationItems: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...mobileRecommendationItemsStyles(theme),
    },
  },
  recommendationWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      pt: theme.space.xl,
      pb: theme.space.s,
    },
  }),
  comparablePrice: {
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.xs,
    letterSpacing: theme.letterSpacings.xs,
    lineHeight: theme.lineHeights.xl,
  },
})

export default {
  parts: [
    'certonaTitle',
    'mobileRecommendationWrapper',
    'contentDivider',
    'recommendationWrapper',
    'atcRecommendationMobile',
    'RecommendationItem',
    'RecommendationItemWrapper',
    'productName',
    'productNameWrapper',
    'recommendedPriceMainWrapper',
    'recommendedPriceText',
    'priceDiscount',
    'mobileRecommendationItems',
    'mainRecommendationWrapper',
  ],
  variants: {
    pdpV3RecommendationMobile: ({ theme }) => ({
      ...certonaStyles(theme),
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: theme.fontSizes.md,
        letterSpacing: theme.letterSpacings.xs,
        lineHeight: theme.lineHeights.s,
        color: theme.colors.main.black,
        textAlign: 'left',
        paddingRight: theme.space.mar,
      }),
      mobileRecommendationWrapper: {
        mt: theme.space.s,
      },
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
        ...recommendationItemWrapperStyles,
        w: '130px',
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'center',
          fontSize: theme.fontSizes.xs,
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: theme.lineHeights.lg,
        },
      },
      productNameWrapper: () => ({
        ...productNameWrapperStyles(theme),
        maxWidth: '100%',
        mt: '9px',
      }),
      recommendedPriceMainWrapper: {
        ...recommendedPriceMainWrapperStyles(theme),
        mt: '0 !important',
      },
      recommendedPriceText: (showSaleColor) => ({
        ...recommendedPriceTextStyles(theme, showSaleColor),
        fontSize: theme.fontSizes.xs,
      }),
      mobileRecommendationItems: {
        ...mobileRecommendationItemsStyles(theme),
      },
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: theme.space.xl,
          pb: '60px',
        },
      }),
      mainRecommendationWrapper: () => ({
        '& .certona_title': {
          pl: theme.space.mar,
          marginBottom: '0px',
        },
      }),
      contentDivider: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          minHeight: 'unset',
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      ...certonaStyles(theme),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'center',
          fontSize: theme.fontSizes.md,
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: theme.lineHeights.xl,
          display: '-webkit-box',
          lineClamp: 1,
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          whiteSpace: 'normal',
        },
      },
      recommendedPriceMainWrapper: {
        px: 0,
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: theme.space.s1,
        },
      },
    }),
  },
}
