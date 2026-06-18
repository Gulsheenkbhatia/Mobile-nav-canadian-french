export default {
  baseStyle: ({ theme }) => ({
    DealPriceWrapper: ({ isMobile, isSticky, isImplicitPromotion }) => ({
      alignItems: 'center',
      mt: isMobile ? (isSticky && isImplicitPromotion ? '-5px' : 0) : '',
      mr: isMobile && isSticky && isImplicitPromotion && '90px',
      pt: 0,
    }),
    DealPriceBox: ({ salePrice }) => ({
      mr: 'xs',
      display: 'flex',
      alignItems: 'center',
      bg: salePrice === undefined ? theme.colors.main.inactive : '',
      minHeight: 'auto',
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      DealPriceText: () => ({
        ...theme.typography['text-display1-xs'],
        color: theme.colors.main.black,
      }),
      DisPercentOffText: {
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-success-primary)',
      },
    }),
  },
}
