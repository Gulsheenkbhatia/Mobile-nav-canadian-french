export default {
  baseStyle: ({ theme }) => ({
    recommendedCategoriesWrapper: {
      background: 'var(--color-text-cta-primary)',
    },
    recommendedCategoriesLabel: {
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-24)',
      fontWeight: '400',
    },
    recommendedCategoryTitle: {
      fontSize: 'var(--text-14)',
      fontFamily: 'var(--font-face1-normal)',
      lineHeight: 'var(--line-height-xl)',
      textTransform: 'none',
    },
    recommendedCategoriesMenuButton: {
      background: 'var(--neutrals-color-neutral-light, #F7F7F7)',
      lineHeight: 'var(--line-height-xl)',
      '&:hover, &:active': {
        background: 'var(--neutrals-color-neutral-light, #F7F7F7) !important',
      },
      '& svg': {
        width: '19px',
        height: '19px',
      },
    },
    recommendedCategoriesInnerContainer: {
      flexDirection: 'column',
      marginTop: 'var(--spacing-4)',
      '& .recommended-category': {
        marginBottom: 'var(--spacing-4)',
        '&:last-child': {
          marginBottom: '0',
        },
      },
    },
    recommendedCategoryProductImage: {
      backgroundColor: 'var(--color-product-image-bg)',
    },
  }),
  variants: {
    pdpV4: () => ({
      recommendedCategoriesMenuButton: {
        background: 'var(--neutrals-color-neutral-light, #F7F7F7)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xl)',
      },
    }),
    plp: ({ theme }) => ({
      recommendedCategoriesLabel: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
        },
      },
      recommendedCategoriesInnerContainer: {
        '& .recommended-category': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            my: theme.space.s3,
          },
        },
      },
      recommendedCategoriesMenuButton: {
        background: 'var(--neutrals-color-neutral-light, #F7F7F7)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xl)',
        textTransform: 'none',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
        },
      },
      recommendedCategoryTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      recommendedProducts: {
        '& .comparablePriceWrapper span, & .bundle-comparable-price': {
          ...theme.typography['text-body1-s'],
          fontWeight: 400,
        },
        '& .salePriceWrapper span': {
          ...theme.typography['text-body2-s'],
          fontWeight: 500,
        },
        '& .salePriceWrapper .strikethroughListPrice': {
          fontWeight: 400,
        },
        '& .with-comparable-price': {
          '& .salePriceWrapper span': {
            ...theme.typography['text-body2-m'],
          },
        },
      },
    }),
    hp: ({ theme }) => ({
      recommendedCategoriesLabel: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
        },
      },
      recommendedCategoriesInnerContainer: {
        '& .recommended-category': {
          marginBottom: 'var(--spacing-4)',
          '&:last-child': {
            marginBottom: '0',
          },
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            my: theme.space.s3,
          },
        },
      },
      recommendedCategoriesMenuButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
        },
        '& svg': {
          width: '19px',
          height: '19px',
        },
      },
      recommendedCategoryTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      recommendedProducts: {
        '& .comparablePriceWrapper span, & .bundle-comparable-price': {
          ...theme.typography['text-body1-s'],
        },
        '& .salePriceWrapper  span': {
          ...theme.typography['text-body2-m'],
        },
      },
    }),
  },
}
