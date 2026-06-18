export default {
  parts: [
    'cartContentContainer',
    'myBagHeader',
    'promotionMsg',
    'miniCartProductsContainer',
    'miniCartPriceDivider',
    'myBagInfo',
  ],
  baseStyle: ({ theme }) => {
    const { colors } = theme
    const { main } = colors
    return {
      myBagHeader: {
        ...theme.typography['text-display1-s'],
      },
      cartContentContainer: {
        top: '6px',
      },
      promotionMsg: {
        display: 'flex',
        alignItems: 'center',
        '.promo-check-svg': {
          display: 'inline-block',
          marginRight: theme.space.s,
          position: 'relative',
          bottom: '1px',
        },
        '.promo-check-svg > path': {
          fill: theme.colors.success.primary,
        },
      },
      miniCartProductsContainer: {
        pr: 'mar',
        mr: '-m',
        mt: 0,

        '@media (max-width: 768px)': {
          pr: 'l',
          mr: '-l',
        },
      },
      miniCartPriceDivider: {
        borderColor: main.gray,
        mx: 'mar',
        height: '30px',
      },
      myBagInfo: (isDesktop) => ({
        borderBottom: `1px solid ${main.gray}`,
        pb: isDesktop ? 'l' : 's',
      }),
    }
  },
}
