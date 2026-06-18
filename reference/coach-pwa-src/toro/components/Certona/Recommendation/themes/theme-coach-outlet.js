export default {
  baseStyle: ({ theme }) => ({
    productName: {
      display: '-webkit-box',
      lineClamp: 2,
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
    recommendedPriceText: (showSaleColor) => ({
      color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.black,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.xl,
      textAlign: 'left',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: theme.colors.main.black,
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    }),
    certonaTitle: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-28)',
      },
      fontSize: 'var(--text-44)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      textTransform: 'capitalize',
    }),
    priceDiscount: (showSaleColor) => ({
      fontSize: theme.fontSizes.sm,
      color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.gray,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-success-primary)',
      },
    }),
    comparablePrice: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-primary)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
  }),
  variants: {
    inlinegrid: () => ({
      certonaTitle: () => ({
        fontSize: 'var(--text-28)',
        lineHeight: 'var(--line-height-xs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
        textAlign: 'left',
        textTransform: 'capitalize',
      }),
    }),
    inlinegridV3: ({ theme }) => ({
      certonaTitle: () => ({
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-28)',
        lineHeight: 'var(--line-height-xs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-primary)',
        textAlign: 'left',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          textAlign: 'center',
          fontSize: 'var(--text-44)',
          color: 'var(--color-black-base)',
          marginBottom: '46px',
        },
      }),
      comparablePrice: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-10)',
        },
      },
      productName: {
        display: 'block',
      },
    }),
    RVRecommendationsItem: () => ({
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
      }),
    }),
    tabbedRecommendation: ({ theme }) => ({
      productName: {
        lineClamp: 1,
        WebkitLineClamp: 1,
      },
      comparablePrice: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-10)',
          color: 'var(--color-neutral-1)',
        },
      },
      priceDiscount: () => ({
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-success-primary)',
      }),
    }),
    aeDrawer: ({ theme }) => ({
      recommendedPriceText: () => ({
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
        },
      }),
      priceDiscount: () => ({
        color: 'var(--color-sale)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-success-primary)',
          fontSize: 'var(--text-12)',
        },
      }),
    }),
    aeDrawerGrid: ({ theme }) => ({
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
        },
        px: '20px', // missing in the design token
        py: '14px', // missing in the design token
      }),
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
        },
      }),
      priceDiscount: () => ({
        color: 'var(--color-sale)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-success-primary)',
          fontSize: 'var(--text-12)',
        },
      }),
    }),
    LLMRecommendation: ({ theme }) => ({
      productName: {
        ...theme.typography['text-body1-l'],
        fontFamily: 'var(--font-face1-extended-bold)',
        display: '-webkit-box',
        lineClamp: 1,
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
      },
    }),
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      productName: {
        display: '-webkit-box',
        lineClamp: 1,
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
      },
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          mt: theme.space.s1,
        },
      },
    }),
    metaPLP: ({ theme }) => ({
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
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-bold)',
        px: 'var(--spacing-4)',
        fontFeatureSettings: '"liga" off, "clig" off',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      mobileRecommendationGrid: {
        columnGap: 'none',
        rowGap: 'none',
        mb: '27px',
        width: '100%',
        padding: 'var(--spacing-0)',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      recommendationWrapper: () => ({
        pl: '0',
      }),
      recommendedPriceMainWrapper: {
        px: 'var(--spacing-4)',
        '&.recommended-price': {
          marginTop: '7px',
        },
      },
      addToBagButtonWrapper: {
        mt: 'var(--spacing-2)',
        mb: 'var(--spacing-2)',
      },

      addToBagStyles: {
        button: {
          padding: '10px 14px 10px 9px',
          border: '1px solid rgba(0,0,0,0.08)',
        },
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'start',
        gap: 'var(--spacing-1)',
      }),
      comparablePrice: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-price-comp-value)',
        },
      },
      recommendedPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      }),
      priceDiscount: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          display: 'block !important',
          color: 'var(--color-success-primary)',
        },
      }),
    }),
    goneViralRecommendation: () => ({
      productName: {
        display: 'block',
        lineClamp: 1,
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'nowrap',
      },
    }),
  },
}
