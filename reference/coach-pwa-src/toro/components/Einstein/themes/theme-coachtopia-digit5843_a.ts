export default {
  parts: [
    'recommendationWrapper',
    'einsteinTitle',
    'mobileRecommendationItems',
    'mobileRecommendationWrapper',
    'productWrapper',
    'productImageWrapper',
    'productImage',
    'productNameWrapper',
    'productName',
    'recommendedPriceMainWrapper',
    'recommendedPriceTextWrapper',
    'recommendedPriceText',
    'oldPriceText',
  ],
  variants: {
    pdpV3EinsteinRecommendationMobile: ({ theme }) => ({
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderTop: 'none',
          flexDirection: 'column',
          padding: `26px 0 34px`,
          width: '100%',
        },
      }),
      einsteinTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: theme.colors.main.primary,
          textAlign: 'left',
          px: theme.space.mar,
          mb: '15px',
          ...theme.typography['text-display1-l'],
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
          width: '200px',
        },
      }),
      productImageWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '200px',
          height: '250px',
        },
      }),
      productImage: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '200px',
          height: '250px',
        },
      }),
      productNameWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: theme.space.mar,
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display2-xs'],
        },
      },
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '6px 0 0 !important',
          justifyContent: 'left',
          gap: '6px',
        },
      },
      recommendedPriceTextWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'max-content',
        },
      },
      recommendedPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: theme.colors.main.black,
          textAlign: 'left',
          ...theme.typography['text-display2-xs'],
        },
      }),
      oldPriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: theme.colors.neutral.medium,
          textAlign: 'left',
          width: 'max-content',
          ...theme.typography['text-display2-xs'],
        },
      },
    }),
  },
}
