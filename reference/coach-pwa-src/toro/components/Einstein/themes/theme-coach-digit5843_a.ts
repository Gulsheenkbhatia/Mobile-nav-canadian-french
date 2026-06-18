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
          ...theme.typography['text-display1-m'],
          fontFamily: theme.fontFamily.primaryBold,
          fontWeight: 'normal',
          fontSize: theme.fontSizes.xlg,
          lineHeight: theme.lineHeights.xs,
          letterSpacing: theme.letterSpacings.xs,
          color: theme.colors.main.primary,
          textAlign: 'left',
          px: theme.space.mar,
          mb: '15px',
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
          ...theme.typography['text-body1-l'],
          fontFamily: theme.fontFamily.primaryNormal,
          fontSize: theme.fontSizes.md,
          letterSpacing: theme.letterSpacings.xs,
          lineHeight: theme.lineHeights.lg,
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
          ...theme.typography['text-body1-l'],
          color: theme.colors.main.black,
          fontFamily: theme.fontFamily.primaryNormal,
          fontSize: theme.fontSizes.md,
          lineHeight: theme.lineHeights.lg,
          letterSpacing: theme.letterSpacings.xs,
          textAlign: 'left',
        },
      }),
      oldPriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          color: theme.colors.neutral.medium,
          fontFamily: theme.fontFamily.primaryNormal,
          fontSize: theme.fontSizes.md,
          lineHeight: theme.lineHeights.lg,
          letterSpacing: theme.letterSpacings.xs,
          textAlign: 'left',
          width: 'max-content',
        },
      },
    }),
    pdpV4EinsteinRecommendationMobile: ({ theme }) => ({
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderTop: 'none',
          flexDirection: 'column',
          padding: `26px 0 40px`,
          width: '100%',
        },
      }),
    }),
  },
}
