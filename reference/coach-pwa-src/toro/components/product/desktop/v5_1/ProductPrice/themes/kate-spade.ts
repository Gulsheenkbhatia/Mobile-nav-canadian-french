const commonTypography = {
  fontSize: 'var(--text-20)',
  lineHeight: 'var(--line-height-120)',
  letterSpacing: 'var(--letter-spacing-m, 0.025rem)',
}

export default {
  parts: ['productPriceRow', 'productPrice', 'comparablePrice', 'oldPrice', 'discount'],
  baseStyle: () => ({
    productPriceRow: {
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      mb: '18px',
      '& + div': {
        marginTop: 'var(--spacing-0)',
      },
    },
    productPrice: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 500,
      ...commonTypography,
    },
    comparablePrice: {
      color: '#6D6D6D', // missing in design token
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 500,
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-120)',
      letterSpacing: 'var(--letter-spacing-m, 0.025rem)',
      whiteSpace: 'nowrap',
    },
    oldPrice: {
      color: 'var(--color-neutral-base, #949494)',
      textDecoration: 'line-through',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
      ...commonTypography,
    },
    discount: {
      color: 'var(--color-green-500, #057550)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
      ...commonTypography,
      whiteSpace: 'nowrap',
    },
  }),
}
