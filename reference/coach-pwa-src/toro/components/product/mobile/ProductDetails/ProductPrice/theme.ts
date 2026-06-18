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
      gap: 'var(--spacing-2)',
      '&:not(:has(.outlet-price-container))': {
        '& .regular-price': {
          mt: '2px',
        },
      },
    },
    productPrice: {
      ...theme.typography['text-title1-m'],
      fontFamily: 'var(--font-face1-extended-bold)',
      color: 'var(--color-primary, #000003)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '125%',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    productPriceRow: {
      gap: '3px',
      flexWrap: 'nowrap',
    },
    comparablePrice: {
      ...theme.typography['text-title1-xs'],
      color: 'var(--color-grey-80)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-10)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '125%',
      letterSpacing: 'var(--letter-spacing-xs)',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      mt: '2px',
    },
    oldPrice: {
      ...theme.typography['text-title1-m'],
      color: 'var(--neutrals-color-neutral-medium, #696969)',
      textDecoration: 'line-through',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '125%',
      letterSpacing: 'var(--letter-spacing-xs)',
      display: 'flex',
      alignItems: 'flex-end',
    },
    discount: {
      ...theme.typography['text-title1-m'],
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '125%',
      letterSpacing: 'var(--letter-spacing-xs)',
      whiteSpace: 'nowrap',
      color: 'var(--color-price-percentage)',
      mt: '2px',
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
