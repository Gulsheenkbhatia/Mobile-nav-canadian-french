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
    'recommendationSliderWrapper',
    'mainRecoWrapperStyles',
    'productImageMainWrapper',
  ],
  variants: {
    pdpV3EinsteinRecommendationMobile: ({ theme }) => ({
      recommendationWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderTop: 'none',
          flexDirection: 'column',
          padding: 'var(--spacing-8) 0',
          width: '100%',
        },
      }),
      einsteinTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontWeight: 700,
          fontSize: 'var(--text-24)',
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 1,
          textAlign: 'left',
          color: 'var(--color-primary)',
          paddingLeft: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-3)',
        },
      },
      mobileRecommendationItems: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridGap: 'var(--spacing-2)',
          padding: '0 var(--spacing-3)',
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
          marginTop: '15px',
        },
      }),
      productName: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 1,
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
      recommendedPriceMainWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '7px 0 0 !important',
          display: 'flex',
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
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          lineHeight: 1,
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
      oldPriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m-line-through'],
          color: 'var(--color-neutral-medium)',
          lineHeight: 1,
          fontSize: 'var(--text-14)',
          width: 'max-content',
        },
      },
    }),
  },
}
