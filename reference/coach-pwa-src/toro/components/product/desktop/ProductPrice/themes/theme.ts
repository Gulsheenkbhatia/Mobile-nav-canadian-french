export default {
  parts: [
    'productPriceWrapper',
    'productPrice',
    'productPriceRow',
    'comparablePrice',
    'oldPrice',
    'discount',
  ],
  baseStyle: ({ theme }) => ({
    productPriceWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '23%',
      flexGrow: 1,
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.black,
      '&.sub-brand-price-container': {
        '& .regular-price': {
          mt: 0,
        },
        '& .discount-rate': {
          mt: 0,
        },
      },
    },
    productPrice: {
      ...theme.typography['text-cta2-xs'],
      fontFamily: 'var(--font-face1-extended-bold)',
    },
    productPriceRow: {
      gap: '2px',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      '& + div': {
        marginTop: '3px',
      },
      '&.outlet-price-container': {
        mt: '1px',
        alignItems: 'baseline',
      },
      '&:not(.outlet-price-container)': {
        '& .product-price-with-discount': {
          color: 'var(--color-price-percentage)',
        },
      },
    },
    comparablePrice: {
      ...theme.typography['text-cta2-xxs'],
      color: 'var(--color-neutral-1)',
      whiteSpace: 'nowrap',
    },
    oldPrice: {
      color: 'var(--color-neutral-1, #6d6d6d)',
      textDecoration: 'line-through',
      ...theme.typography['text-cta2-xs'],
    },
    discount: {
      ...theme.typography['text-cta2-xs'],
      color: 'var(--color-neutral-1, #6d6d6d)',
      whiteSpace: 'nowrap',
      '&.outlet-discount-rate': {
        color: 'var(--color-price-percentage)',
      },
    },
  }),
  variants: {
    coachtopia: () => ({
      productPrice: {
        fontFamily: 'var(--font-face1-bold)',
      },
      comparablePrice: {
        fontFamily: 'var(--font-face1-normal)',
      },
      oldPrice: {
        fontFamily: 'var(--font-face1-normal)',
      },
      discount: {
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
  },
}
