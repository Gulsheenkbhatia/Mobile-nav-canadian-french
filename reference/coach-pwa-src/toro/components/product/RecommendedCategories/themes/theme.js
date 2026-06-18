export default {
  baseStyle: ({ theme }) => ({
    recommendedCategoriesWrapper: {
      flexDirection: 'column',
      margin: 'var(--spacing-6) var(--spacing-3) var(--spacing-8)',
      padding: 'var(--spacing-6) var(--spacing-3)',
      borderRadius: 'var(--border-radius-xl)',
      background: 'var(--color-background-cta-hover)',
    },
    recommendedCategoriesLabel: {
      ...theme.typography['text-display4-xxs'],
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-16)',
      fontWeight: '700',
      lineHeight: 'var(--line-height-120)',
      letterSpacing: 'var(--letter-spacing-s)',
      fontStyle: 'normal',
    },
    recommendedCategoriesInnerContainer: {
      flexDirection: 'column',
      marginTop: 'var(--spacing-4)',
      '& .recommended-category': {
        marginBottom: 'var(--spacing-3)',
        '&:last-child': {
          marginBottom: '0',
        },
      },
    },
    recommendedCategoriesMenuButton: {
      marginTop: 'var(--spacing-4)',
      borderRadius: '130px',
      padding: '10px 14px',
      background: 'var(--color-text-cta-primary)',
      textAlign: 'center',
      ...theme.typography['text-cta2-xs'],
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      fontWeight: '400',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: 'var(--color-text-cta-primary) !important',
      },
    },
    recommendedCategoryWrapper: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    recommendedCategoryImageWrapper: {
      w: '40px',
      minWidth: '40px',
      h: '50px',
      borderRadius: '2.7px',
      overflow: 'hidden',
      display: 'flex',
      '& img': { borderRadius: '4px' },
    },
    recommendedCategoryTitle: {
      ...theme.typography['text-cta2-s'],
      marginLeft: 'var(--spacing-4)',
      fontWeight: '400',
    },
    skeletonProductsWrapper: {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      overflowX: 'auto',
      marginTop: 'var(--spacing-3)',
      marginBottom: 'var(--spacing-4)',
      marginLeft: 'calc(0px - var(--spacing-3))',
      width: 'calc(100% + var(--spacing-6))',
      paddingLeft: 'var(--spacing-3)',
      paddingRight: 'var(--spacing-3)',
    },
    skeletonProductImage: { minHeight: '133px', minWidth: '133px', borderRadius: '8px' },
    skeletonProductText: { marginTop: '6px', display: 'flex' },
    skeletonProductPrice: { height: 'var(--spacing-4)', width: '55px' },
    recommendedCategoryProductImage: {
      minHeight: '133px',
      minWidth: '133px',
      aspectRatio: '1/1',
      borderRadius: '8px',
      marginBottom: 'var(--spacing-1)',
      objectFit: 'contain',
      backgroundColor: 'var(--color-page-bg)',
    },
    recommendedCategoryFinalProductLink: {
      ...theme.typography['text-link2-s'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      fontWeight: '400',
      color: 'var(--color-black-base)',
      height: '133px',
      minWidth: '133px',
      aspectRatio: 1,
      borderRadius: '8px',
      backgroundColor: 'white',
      border: '1px solid var(--color-neutral-light-3)',
      textDecoration: 'underline',
      textDecorationSkipInk: 'none',
      textAlign: 'center',
      padding: '14px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    recommendedProducts: {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      overflowX: 'auto',
      marginTop: 'var(--spacing-3)',
      marginBottom: 'var(--spacing-4)',
      marginLeft: 'calc(0px - var(--spacing-3))',
      width: 'calc(100% + var(--spacing-6))',
      paddingLeft: 'var(--spacing-3)',
      paddingRight: 'var(--spacing-3)',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },

      '& .comparablePriceWrapper span, & .bundle-comparable-price': {
        fontSize: 'var(--text-10)',
      },
      '& .salePriceWrapper': {
        justifyContent: 'start',
      },
      '& .pricing-wrapper': {
        marginTop: 0,
      },
      '& .bundlePriceContent': {
        justifyContent: 'start',
      },
    },
  }),
  variants: {
    pdpV4: () => ({
      recommendedCategoriesWrapper: {
        background: 'var(--color-text-cta-primary)',
      },
      recommendedCategoriesMenuButton: {
        background: 'var(--color-background-cta-hover)',
        '&:hover': {
          backgroundColor: 'var(--color-background-cta-hover) !important',
        },
      },
    }),
    plp: ({ theme }) => ({
      recommendedCategoriesWrapper: {
        background: 'var(--color-text-cta-primary)',
      },
      recommendedCategoriesLabel: {
        ...theme.typography['text-display4-xxs'],
      },
      recommendedCategoriesMenuButton: {
        ...theme.typography['text-cta2-xs'],
        background: 'var(--color-background-cta-hover)',
        '&:hover': {
          backgroundColor: 'var(--color-background-cta-hover) !important',
        },
      },
    }),
    hp: () => ({
      recommendedCategoriesLabel: {
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: '400',
      },
      recommendedCategoryTitle: {
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
  },
}
