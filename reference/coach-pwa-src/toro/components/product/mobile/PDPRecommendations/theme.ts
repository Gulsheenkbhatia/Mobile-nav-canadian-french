const itemWidth = '228.5px'
const itemHeight = '285px'
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
    'skeletonRootWrapper',
    'skeletonTitle',
    'skeletonTilesWrapper',
    'skeletonProductName',
    'skeletonMobileMainWrapper',
    'skeletonBox',
    'skeletonTwoMobile',
    'RecommendationItem',
    'RecommendationItemWrapper',
    'addToBagButtonWrapper',
    'atbEnabledProductName',
    'comparablePriceWrapper',
    'priceContainer',
  ],
  baseStyle: ({ theme }) => ({
    productNameWrapper: () => ({
      ...theme.typography['text-display4-xxs'],
      fontFamily: 'var(--font-face1-extended-bold)',
      mt: 'var(--spacing-4)',
      mx: 0,
    }),
    recommendedPriceMainWrapper: {
      px: 0,
      '&.recommended-price': {
        marginTop: '0',
      },
    },
    mobileRecommendationWrapper: {
      mt: 0,
    },
    RecommendationItem: () => ({
      h: itemHeight,
      w: itemWidth,
    }),
    productImageMainWrapper: () => ({
      position: 'relative',
      width: itemWidth,
      height: 'auto',
    }),
    productImageWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
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
    skeletonRootWrapper: {
      pt: 'var(--spacing-10)',
      pb: 'var(--spacing-6)',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    skeletonTitle: () => ({
      mt: 0,
      '& div': {
        mb: 0,
      },
    }),
    skeletonTilesWrapper: {
      mb: 0,
    },
    skeletonProductName: () => ({
      mb: 0,
    }),
    skeletonMobileMainWrapper: {
      px: 'var(--spacing-3)',
    },
    skeletonBox: {
      borderRadius: '4px',
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
      ...theme.typography['text-display4-xxs'],
      fontFamily: 'var(--font-face1-extended-bold)',
      p: '0 var(--spacing-4)',
      display: 'block',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
    mobileRecommendationItems: {
      gridGap: 'var(--spacing-3)',
      pr: 'var(--spacing-4)',
      pl: 'var(--spacing-4)',
    },
    comparablePriceWrapper: () => ({
      display: 'none',
    }),
    priceContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        textAlign: 'center',
        pt: 'var(--spacing-2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: 'var(--spacing-1)',
      },
    }),
    addToBagButtonWrapper: {
      mt: 'var(--spacing-2)',
    },
    recommendedPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        textAlign: 'center',
      },
    }),
    RecommendationItemWrapper: () => ({
      height: '100%',
      width: '100%',
      maxWidth: itemWidth,
      minWidth: itemWidth,
    }),
  }),
}
