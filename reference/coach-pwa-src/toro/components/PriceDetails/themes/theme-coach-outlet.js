/**
 * PriceDetails Theme - Coach Outlet
 *
 * Brand-specific theme overrides for Coach Outlet
 */

export default {
  parts: ['priceWrapper', 'priceText'],
  baseStyle: ({ theme }) => ({
    priceWrapper: {
      textAlign: 'center',
    },
    priceText: {
      color: theme.colors.main.black,
      fontFamily: 'var(--font-face1-extended-normal)',
      fontWeight: 400,
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
    },
  }),
}
