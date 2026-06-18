/**
 * PriceDetails Theme Configuration
 *
 * Theme for PriceDetails component - displays only final out-of-door price
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
