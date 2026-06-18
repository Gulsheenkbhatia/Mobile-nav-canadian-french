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
      ...theme.typography['text-body1-xl'],
      color: 'var(--color-primary)',
      fontWeight: '400',
    },
    productPriceRow: {
      gap: 'var(--spacing-1)',
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
    },
    comparablePrice: {
      ...theme.typography['text-body2-xs'],
      color: 'var(--color-primary)',
      whiteSpace: 'nowrap',
      fontWeight: '500',
    },
    oldPrice: {
      color: 'var(--color-neutral-medium, #575757)',
      textDecoration: 'line-through',
      ...theme.typography['text-body1-xl'],
      fontWeight: '400',
    },
    discount: {
      ...theme.typography['text-body1-xl'],
      color: 'var(--color-neutral-medium, #575757)',
      whiteSpace: 'nowrap',
      fontWeight: '400',
      '&.outlet-discount-rate': {
        color: 'var(--color-neutral-medium, #575757)',
      },
    },
  }),
}
