export default {
  parts: [
    'mobileRecommendationItems',
    'wrapper',
    'title',
    'price',
    'mobileRecommendationGrid',
    'recommendationGridWrapper',
  ],
  baseStyle: ({ theme }) => ({
    wrapper: {
      pt: 'var(--spacing-8)',
      pb: 'var(--spacing-2)',
    },
    title: {
      ...theme.typography['text-display4-s'],
      fontFamily: 'var(--font-face1-extended-bold)',
      pl: 'var(--spacing-3)',
    },
    mobileRecommendationItems: {
      overflowX: 'scroll',
      gridGap: 2,
      mt: '14px',
      px: 'var(--spacing-3)',
    },
    price: {
      ...theme.typography['text-body1-m'],
      fontSize: 'var(--text-16)',
      color: 'var(--color-black-base)',
      pt: 'var(--spacing-1)',
      display: 'inline',
    },
    priceWrapper: {
      marginTop: 'var(--spacing-3)',
    },
    priceDiscount: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-success-primary)',
      display: 'inline',
      marginLeft: 'var(--spacing-2)',
    },
    comparablePrice: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      color: 'var(--color-primary)',
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'var(--letter-spacing-xs)',
      marginBottom: '-4px',
    },
    llmPromotion: {
      color: 'var(--color-success-primary)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-xl)',
      my: 'var(--spacing-2)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-bold)',
      },
    },
  }),
  variants: {
    aeDrawerGrid: ({ theme }) => ({
      title: {
        ...theme.typography['text-display1-s'],
        color: 'var(--color-black-base)',
        pl: '0px',
        pb: 'var(--spacing-3)',
      },
      recommendationGridWrapper: {
        px: '20px', // missing in the design token
        pt: 'var(--spacing-3)',
        pb: 'var(--spacing-4)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
        },
      },
      mobileRecommendationGrid: {
        columnGap: 's1',
        rowGap: '9px',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          rowGap: '15px',
        },
      },
    }),
  },
}
