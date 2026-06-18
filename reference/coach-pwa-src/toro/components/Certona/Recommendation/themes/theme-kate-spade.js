const ITEMS_PER_SLIDE = 2.75

const tabbedRecommendationVariant = (theme) => ({
  recommendedPriceMainWrapper: {
    '&.recommended-price': {
      marginTop: 'var(--spacing-1)',
    },
  },
  recommendedPriceText: () => ({
    ...theme.typography['text-body2-s'],
    fontSize: 'var(--text-12)',
    fontWeight: 500,
  }),
  priceDiscount: (showSaleColor) => ({
    ...theme.typography['text-body1-s'],
    fontSize: 'var(--text-12)',
    color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.gray,
  }),
  priceStrikeoff: {
    ...theme.typography['text-body1-s'],
    color: 'var(--color-neutral-dark)',
  },
  comparablePriceWrapper: () => ({
    flexDirection: 'row',
    gap: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-1)',
  }),
  comparablePrice: {
    ...theme.typography['text-body1-s'],
    color: 'var(--color-neutral-dark)',
    fontSize: 'var(--text-10)',
  },
  productName: {
    fontFamily: 'var(--font-face1-normal)',
    textAlign: 'left',
  },
  skeletonTile: () => ({
    height: 'auto',
    aspectRatio: '4/5',
    width: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
    maxWidth: `calc((100vw - 1rem) / ${ITEMS_PER_SLIDE})`,
    borderRadius: 'var(--border-radius-none)',
  }),
})

export default {
  parts: [
    'certonaTitle',
    'recommendedPriceText',
    'priceDiscount',
    'priceStrikeoff',
    'recommendedPriceColor',
    'productName',
    'productNameWrapper',
    'recommendedPriceMainWrapper',
    'productImageWrapper',
  ],
  baseStyle: ({ theme }) => ({
    certonaTitle: (isDesktop) => ({
      color: 'var(--color-black-base)',
      textAlign: isDesktop ? 'center' : 'left',
      ...(isDesktop
        ? { ...theme.typography['text-display1-m'] }
        : { ...theme.typography['text-display1-s'] }),
    }),
    productNameWrapper: () => ({
      mt: 'var(--spacing-3)',
      mx: 'var(--spacing-2)',
    }),
    recommendedPriceMainWrapper: {
      px: 'var(--spacing-2)',
      m: 'var(--spacing-3) 0 0 0',
      ...theme.typography['text-body2-m'],
      '&.recommended-price': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'var(--spacing-2)',
      },
    },
    productName: {
      ...theme.typography['text-body2-m'],
      textAlign: 'center',
    },
    priceContainer: () => ({
      '@media (max-width: 769px)': {
        justifyContent: 'start',
        flexWrap: 'wrap',
        rowGap: 0,
      },
      display: 'flex',
      justifyContent: 'center',
      gap: theme.space.s,
    }),
    recommendedPriceText: (showSaleColor) => ({
      textAlign: 'left',
      ...theme.typography['text-body2-s'],
      overflow: 'hidden',
      color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.gray,
    }),
    priceStrikeoff: {
      ...theme.typography['text-body2-s'],
      textDecoration: 'line-through',
      color: theme.colors.main.gray,
    },
    priceDiscount: (showSaleColor) => ({
      ...theme.typography['text-body2-s'],
      color: showSaleColor ? theme.colors.main.saleRed : theme.colors.main.gray,
    }),
    oldPriceText: {
      ...theme.typography['text-body2-m'],
      color: 'var(--color-neutral-base)',
      overflow: 'hidden',
      textAlign: 'left',
    },
    comparablePriceWrapper: () => ({
      '@media (max-width: 769px)': {
        justifyContent: 'left',
        flexWrap: 'wrap',
        rowGap: 0,
      },
      gap: theme.space.s1,
      justifyContent: 'center',
    }),
    clickToShopbtnContainer: {
      mt: 'var(--spacing-3)',
      display: 'flex',
      justifyContent: 'center',
    },
    clickToShopbtn: {
      ...theme.typography['text-cta1-xs'],
      padding: 'var(--spacing-2)',
      height: 'auto',
    },
  }),
  variants: {
    inlinegrid: ({ theme }) => ({
      certonaTitle: () => ({
        ...theme.typography['text-display1-s'],
      }),
    }),
    inlinegridV3: ({ theme }) => ({
      certonaTitle: () => ({
        ...theme.typography['text-display1-m'],
        color: 'var(--color-black-base)',
        textAlign: 'center',
        mb: 'var(--spacing-6)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
        },
      }),
      recommendationWrapper: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          py: 'var(--spacing-12)',
          '& .splide__arrow:disabled': {
            backgroundColor: 'var(--color-product-image-bg)',
          },
        },
      }),
      addToBagStyles: {
        buttonText: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            fontSize: 'var(--text-14)',
          },
        },
      },
      productName: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
        },
      },
      recommendedPriceText: (showSaleColor) => ({
        ...theme.typography['text-body2-s'],
        color: showSaleColor ? 'var(--color-error-primary)' : 'var(--color-black-base)',
        textAlign: 'center',
        fontWeight: 700,

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontSize: 'var(--text-14)',
          fontWeight: 700,
        },
      }),
      recommendedPriceColor: {
        color: 'var(--color-error-primary)',
      },
      priceDiscount: () => ({
        ...theme.typography['text-body2-s'],
        color: 'var(--color-error-primary)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
        },
      }),
      priceStrikeoff: {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-neutral-dark)',
        textDecoration: 'line-through',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      comparablePrice: {
        ...theme.typography['text-body1-m'],
        color: 'var(--color-neutral-medium)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    }),
    minicart: ({ theme }) => ({
      certonaTitle: () => ({
        fontWeight: 700,
        ...theme.typography['text-display1-s'],
      }),
      productName: {
        fontFamily: 'var(--font-face2-normal)',
      },
      recommendationWrapper: () => ({
        my: 'var(--spacing-6)',
      }),
      saveForLaterPosition: {
        top: '12px',
        right: '6px',
      },
      priceContainer: () => ({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.space.s,
        rowGap: 0,
      }),
      comparablePriceWrapper: () => ({
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: 0,
        gap: theme.space.s1,
      }),
    }),
    atcRecommendationMobile: ({ theme }) => ({
      certonaTitle: () => ({
        fontWeight: 700,
        ...theme.typography['text-display1-s'],
        pt: 'var(--spacing-3)',
        pl: 'var(--spacing-3)',
      }),
      recommendationSliderWrapper: () => ({
        mt: 'var(--spacing-4)',
      }),
      saveForLaterPosition: {
        top: 'var(--spacing-3)',
        right: 'var(--spacing-2)',
      },
      priceContainer: () => ({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.space.s,
        rowGap: 0,
      }),
      comparablePriceWrapper: () => ({
        justifyContent: 'center',
        flexWrap: 'wrap',
        rowGap: 0,
        gap: theme.space.s1,
      }),
    }),
    RVRecommendationsItem: () => ({
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      }),
      priceStrikeoff: {
        mt: '0px',
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
    aeDrawer: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          marginTop: '2px',
        },
      },
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        '@media (max-width: 544px)': {
          fontFamily: theme.fontFamily.primaryNormal,
          fontWeight: 700,
        },
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
        '@media (max-width: 544px)': {
          fontFamily: theme.fontFamily.primaryNormal,
          fontWeight: 400,
        },
      }),
      priceStrikeoff: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          color: '#696969', //does not exist in design tokens
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
        },
      },
      strikeOffWithDiscount: {
        color: 'var(--color-black-base)',
      },
      productName: {
        ...theme.typography['text-body2-m'],
        fontWeight: 500,
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)',
        marginBottom: 'var(--spacing-1)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          marginBottom: '0px',
        },
      },
      comparablePriceWrapper: () => ({
        justifyContent: 'center',
        columnGap: 'var(--spacing-1)',
        marginBottom: 'var(--spacing-2)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'left',
          marginBottom: '2px',
        },
      }),
      comparablePrice: {
        ...theme.typography['text-body2-m'],
        color: 'var(--color-neutral-base)',
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-normal)',
          color: '#696969', //does not exist in design tokens
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
        },
      },
    }),
    tabbedRecommendation: ({ theme }) => ({
      ...tabbedRecommendationVariant(theme),
    }),
    tabbedPDPRecommendation: ({ theme }) => ({
      ...tabbedRecommendationVariant(theme),
    }),
    aeDrawerGrid: ({ theme }) => ({
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          paddingBottom: 'var(--spacing-4)',
        },
        fontFamily: 'var(--font-face1-bold)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
        paddingBottom: 'var(--spacing-2)',
      }),
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
          py: 'var(--spacing-4) !important',
        },
        px: '20px', // missing in the design token
      }),
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-s'],
        },
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: '#696969', //does not exist in design tokens
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
        },
      },
      strikeOffWithDiscount: {
        color: 'var(--color-black-base)',
      },
      comparablePrice: {
        ...theme.typography['text-body2-m'],
        color: 'var(--color-neutral-base)',
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-s'],
          fontWeight: 500,
          color: 'var(--color-neutral-dark)',
        },
      },
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
        },
      },
    }),
    aeDrawerGridSocial: ({ theme }) => ({
      mobileRecommendationGrid: {
        gap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          paddingBottom: 'var(--spacing-4)',
        },
        fontFamily: 'var(--font-face1-bold)',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
        paddingBottom: 'var(--spacing-2)',
      }),

      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          py: 'var(--spacing-6) !important',
        },
        px: '20px', // missing in the design token
      }),
      productLink: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      productImageMainWrapper: () => ({
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }),
      productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
      productNameWrapper: () => ({
        textAlign: 'center',
      }),
      priceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: 0,
          alignItems: 'center',
        },
        '@media (max-width: 769px)': {
          flexWrap: 'wrap',
          rowGap: 0,
        },
        display: 'flex',
        justifyContent: 'center',
        gap: theme.space.s,
      }),
      productName: {
        fontFamily: 'unset',
        overflow: 'hidden',
        minWidth: 0,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      addToBagButtonWrapper: {
        mt: 'var(--spacing-4)',
        mb: 0,
      },
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            padding: 0,
            marginTop: 'var(--spacing-2)',
          },
        },
        '& .recommendation-tile-price-wrapper': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body2-s'],
            justifyContent: 'center',
            alignItems: 'baseline',
            '.price-text': {
              ...theme.typography['text-body2-s'],
              color: 'var(--color-black-base)',
              fontWeight: 600,
            },
          },
        },
        '& .recommendation-price-comparable': {
          justifyContent: 'start',
        },
      },
      productImageWrapper: {
        mb: 'var(--spacing-3)',
      },
      recommendedPriceText: () => ({
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-135)',
        ...theme.typography['text-body2-s'],

        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-s'],
        },
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 600,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body2-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 600,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: '#696969', //does not exist in design tokens
          fontWeight: 600,
          lineHeight: 'var(--line-height-140)',
        },
      },
      strikeOffWithDiscount: {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-black-base)',
      },
      comparablePrice: {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-neutral-base)',
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 600,
        lineHeight: 'var(--line-height-135)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-s'],
          color: 'var(--color-neutral-dark)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      contentDivider: () => ({
        '&.content-divider': {
          '.certona_wrapper': {
            [`@media (max-width: ${theme.breakpoints.sm})`]: {
              paddingTop: '0',
            },
          },
        },

        '&.content-divider::before': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            display: 'none',
          },
        },
      }),

      certonaTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-m'],
          fontSize: 'var(--text-28)',
          color: 'var(--color-black-base)',
          paddingTop: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-4)',
        },
      }),

      productNameWrapper: () => ({
        marginTop: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-2)',
      }),

      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          textAlign: 'left',
        },
      },

      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            marginTop: 0,
            padding: 0,
          },
        },
        '& .recommendation-tile-price-wrapper': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body2-m'],
            alignItems: 'baseline',
            justifyContent: 'start',
            '.price-text': {
              color: 'var(--color-black-base)',
              fontSize: 'var(--text-14)',
            },
          },
        },
        '& .recommendation-price-comparable': {
          justifyContent: 'start',
        },
      },
      comparablePriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          flexWrap: 'wrap',
          rowGap: 0,
          justifyContent: 'left',
          gap: theme.space.s1,
        },
      }),
    }),
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      productNameWrapper: () => ({
        marginTop: 'var(--spacing-3)',
      }),
      productName: {
        fontFamily: 'var(--font-face1-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          textAlign: 'left',
          padding: 0,
        },
      },
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            padding: 0,
            marginTop: '6px',
          },
        },
        '& .recommendation-tile-price-wrapper': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body1-m'],
            justifyContent: 'start',
            alignItems: 'baseline',
            '.price-text': {
              color: 'var(--color-black-base)',
              fontSize: 'var(--text-14)',
            },
          },
        },
        '& .recommendation-price-comparable': {
          justifyContent: 'start',
        },
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-normal)',
      }),
    }),
    goneViralRecommendation: ({ theme }) => ({
      productName: {
        ...theme.typography['text-body1-s'],
        textAlign: 'left',
      },
      recommendedPriceText: (showSaleColor) => ({
        ...theme.typography['text-body2-s'],
        fontWeight: 500,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: showSaleColor ? '#E01 !important' : 'var(--color-black-base)',
        },
      }),
      comparablePriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          flexWrap: 'wrap',
          justifyContent: 'left',
          gap: theme.space.s1,
          marginBottom: 'var(--spacing-1)',
        },
      }),
      comparablePrice: {
        fontFamily: 'unset',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-xs'],
          color: 'var(--color-neutral-dark)',
        },
      },
      recommendedPriceColor: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-error-primary)',
        },
      },
      priceDiscount: (showSaleColor) => ({
        ...theme.typography['text-body2-s'],
        color: showSaleColor ? '#E01' : 'var(--color-error-primary)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-neutral-dark)',
        textDecoration: 'line-through',
      },
    }),
    EnhancedPDPRecommendation: ({ theme }) => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'var(--spacing-1)',
          padding: '0px',
        },
      },
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-neutral-dark)',
      },
      recommendedPriceText: (showSaleColor) => ({
        ...theme.typography['text-body2-s'],
        textAlign: 'left',
        overflow: 'hidden',
        color: showSaleColor ? theme.colors.main.saleRed : 'var(--color-black-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontWeight: 500,
        },
      }),
      recommendedPriceColor: {
        color: '#E01', // missed from design tokens
        fontFamily: 'var(--font-face1-medium)',
        fontWeight: 500,
      },
      comparablePriceWrapper: () => ({
        justifyContent: 'flex-start',
      }),
      comparablePrice: {
        fontFamily: 'unset',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-xs'],
          fontWeight: 500,
          color: 'var(--color-neutral-dark)',
          mt: '0px',
          marginBottom: '1.5px',
          letterSpacing: 'var(--letter-spacing-xs)',
          '&:first-child': {
            marginRight: 'var(--spacing-1)',
          },
        },
      },
      priceDiscount: (showSaleColor) => ({
        ...theme.typography['text-body1-s'],
        color: showSaleColor ? theme.colors.main.saleRed : 'var(--color-black-base)',
      }),
    }),
    LLMRecommendation: ({ theme }) => ({
      productName: {
        textAlign: 'left',
        ...theme.typography['text-body1-l'],
      },
    }),
    viewSimilarProductsPDP: () => ({
      productImageWrapper: {
        bg: 'var(--color-product-image-bg)',
      },
    }),
    recommendationsStack: () => ({
      certonaTitle: () => ({ display: 'none' }),
      skeletonHorizontalBar: () => ({
        display: 'none',
      }),
      skeletonTitle: (isDesktop) => ({
        height: isDesktop ? '32px' : '34px',
        width: isDesktop ? '36%' : '72%',
        m: isDesktop ? '22px auto' : '16px auto',
      }),
      skeletonTilesWrapper: {
        my: 'var(--spacing-4)',
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
      skeletonTile: (isDesktop) => ({
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
    similarProductRecommendation: () => ({
      productName: {
        fontFamily: 'var(--font-face1-normal)',
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-normal)',
      }),
    }),
    BecauseYouViewedPDPRecommendation: ({ theme }) => ({
      productName: {
        fontFamily: 'var(--font-face1-normal)',
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 700,
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-normal)',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
    becauseYouViewedPLPV2: ({ theme }) => ({
      productName: {
        fontFamily: 'var(--font-face1-normal)',
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-bold)',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
      }),
      priceStrikeoff: {
        fontFamily: 'var(--font-face1-normal)',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
    enchncedATBRecommendationMobile: ({ theme }) => ({
      productName: {
        ...theme.typography['text-body1-s'],
      },
      recommendedPriceText: () => ({
        ...theme.typography['text-body1-s'],
      }),
    }),
    loveAtFirstSwipe: ({ theme }) => ({
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-bold)',
      }),
      priceDiscount: () => ({
        ...theme.typography['text-body1-s'],
      }),
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
      },
      strikeOffWithDiscount: {
        ...theme.typography['text-body1-s'],
      },
      comparablePrice: {
        ...theme.typography['text-body1-xs'],
      },
    }),
    lookbookPDP: ({ theme }) => ({
      priceDiscount: () => ({
        fontFamily: 'var(--font-face1-bold)',
      }),
      priceStrikeoff: {
        ...theme.typography['text-body1-s'],
      },
      strikeOffWithDiscount: {
        ...theme.typography['text-body1-s'],
      },
      comparablePrice: {
        ...theme.typography['text-body1-xs'],
      },
      recommendedPriceText: () => ({
        fontFamily: 'var(--font-face1-bold)',
      }),
    }),
  },
}
