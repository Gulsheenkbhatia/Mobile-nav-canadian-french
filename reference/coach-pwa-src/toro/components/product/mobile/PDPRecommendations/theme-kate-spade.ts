const itemWidth = '228.5px'
const itemHeight = '285px'

const pdpv6PriceStyles = ({ theme }) => ({
  recommendedPriceText: () => ({
    ...theme.typography['text-body1-l'],
    color: 'var(--color-black-base)',
  }),
  priceDiscount: () => ({
    ...theme.typography['text-body1-l'],
    color: theme.colors.main.gray,
  }),
  priceStrikeoff: {
    ...theme.typography['text-body1-l'],
    textDecoration: 'line-through',
    color: theme.colors.main.gray,
  },
})
const pdpv7PriceStyles = ({ theme }) => ({
  recommendedPriceText: () => ({
    ...theme.typography['text-title1-s'],
    fontWeight: 400,
    lineHeight: 'var(--line-height-125)',
    color: 'var(--color-neutral-dark, #4A4A4A)',
  }),
  recommendedPriceColor: {
    ...theme.typography['text-title1-s'],
    fontWeight: 400,
    lineHeight: 'var(--line-height-125)',
    color: 'var(--color-neutral-dark, #4A4A4A)',
  },
  priceDiscount: () => ({
    ...theme.typography['text-body2-m'],
    fontWeight: 400,
    color: 'var(--color-success-primary, #427E2B)',
    lineHeight: 'var(--line-height-135)',
    textTransform: 'capitalize',
  }),
  priceStrikeoff: {
    ...theme.typography['text-title1-s'],
    fontWeight: 400,
    lineHeight: 'var(--line-height-125)',
    color: 'var(--color-neutral-dark, #4A4A4A)',
  },
})

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
    'recommendationWrapper',
    'recommendationSliderWrapper',
    'mobileRecommendationWrapper',
    'mobileRecommendationItems',
    'skeletonMobileMainWrapper',
    'skeletonBox',
    'skeletonTwoMobile',
    'RecommendationItem',
    'RecommendationItemWrapper',
    'atbEnabledProductName',
    'comparablePriceWrapper',
    'priceContainer',
    'addToBagButtonWrapper',
  ],
  baseStyle: ({ theme }) => ({
    ...pdpv6PriceStyles({ theme }),
    productNameWrapper: () => ({
      m: '0 auto',
      mt: '21px',
      w: '70%',
      ...theme.typography['text-display4-xxs'],
    }),
    recommendedPriceMainWrapper: {
      px: 0,
      '&.recommended-price': {
        marginTop: '25px',
      },
    },
    addToBagButtonWrapper: {
      mt: 'var(--spacing-2)',
      mb: 'var(--spacing-6)',
    },
    mobileRecommendationWrapper: {
      mt: 0,
    },
    RecommendationItem: () => ({
      h: '100%',
      w: '100%',
    }),
    productImageMainWrapper: () => ({
      position: 'relative',
      width: itemWidth,
      height: itemHeight,
    }),
    productImageWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
      mb: '20px',
    },
    productImage: () => ({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 'var(--border-radius-s)',
      maxWidth: 'none',
    }),
    productLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    recommendedPriceWrapper: {
      mt: 'var(--spacing-1)',
      px: 'var(--spacing-2)',
    },
    recommendationWrapper: (_, hideYmalOnPDP) => ({
      py: 'var(--spacing-4)',
      px: 'var(--spacing-4)',
      mt: hideYmalOnPDP ? 'var(--spacing-6)' : 'var(--spacing-4)',
    }),
    recommendationSliderWrapper: () => ({
      mt: 'var(--spacing-4)',
    }),
    skeletonMobileMainWrapper: {
      px: 'var(--spacing-3)',
    },
    skeletonBox: {
      borderRadius: 'var(--border-radius-s)',
      backgroundColor: 'var(--color-neutral-light)',
    },
    skeletonTwoMobile: {
      width: itemWidth,
      height: itemHeight,
    },
    atbEnabledProductName: {
      lineClamp: 1,
      WebkitLineClamp: 1,
    },
    productName: {
      ...theme.typography['text-body1-l'],
      p: '0 var(--spacing-4)',
    },
    mobileRecommendationItems: {
      gridGap: 'var(--spacing-3)',
      pr: 'var(--spacing-4)',
      pl: 'var(--spacing-4)',
      mt: 'var(--spacing-3)',
    },
    comparablePriceWrapper: () => ({
      display: 'none',
    }),
    priceContainer: () => ({
      ...theme.typography['text-title2-xxs'],
      fontSize: 'var(--text-16)',
      textAlign: 'center',
      pt: '21px',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title2-m'],
      },
    }),
    RecommendationItemWrapper: () => ({
      height: '100%',
      width: '100%',
      maxWidth: itemWidth,
      minWidth: itemWidth,
    }),
    recommendedPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title2-m'],
        fontWeight: 700,
      },
    }),
  }),
  variants: {
    visuallySimilarPDPv6: ({ theme }) => ({
      ...pdpv6PriceStyles({ theme }),
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          marginTop: '0',
        },
      },
      priceContainer: () => ({
        pt: '0',
        textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: 'var(--spacing-1)',
        rowGap: 0,
      }),
    }),
    aeDrawerGridSocial: ({ theme }) => ({
      productImageMainWrapper: () => ({
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
      priceContainer: () => ({
        ...theme.typography['text-title2-xxs'],
        fontSize: 'var(--text-16)',
        textAlign: 'center',
        alignItems: 'center',
        pt: 'var(--spacing-2)',
      }),
    }),
    visuallySimilarPDPv7: ({ theme }) => ({
      ...pdpv7PriceStyles({ theme }),
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          marginTop: '0',
        },
        '& .recommendation-tile-price-wrapper .price-text': {
          color: 'var(--color-neutral-dark, #4A4A4A) !important',
        },
      },
      priceContainer: () => ({
        mt: 'var(--spacing-1)',
        textAlign: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'left',
        alignItems: 'baseline',
        gap: 'var(--spacing-1)',
        rowGap: 0,
      }),
    }),
  },
}
