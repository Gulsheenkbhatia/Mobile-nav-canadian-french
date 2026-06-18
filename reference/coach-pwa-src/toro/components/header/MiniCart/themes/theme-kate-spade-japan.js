export default {
  parts: [
    'myBagHeader',
    'miniCartProductName',
    'miniCartProductdetail',
    'mainPrice',
    'discountPrice',
    'promotionMsg',
    'promotionSuccessIcon',
    'promotionMsg',
    'cartCheckoutButton',
    'viewShoppingBagButton',
  ],
  baseStyle: ({ theme }) => ({
    myBagHeader: {
      ...theme.typography['text-display2-xs'],
    },
    miniCartProductName: {
      ...theme.typography['text-body2-m'],
    },
    miniCartProductdetail: {
      ...theme.typography['text-body2-s'],
    },
    mainPrice: {
      ...theme.typography['text-body2-l'],
    },
    discountPrice: (priceColor) => ({
      color: priceColor,
      ...theme.typography['text-body2-l'],
    }),
    promotionMsg: {
      color: 'var(--color-black-base)',
      ...theme.typography['text-body1-s'],
      '.promo-check-svg': {
        verticalAlign: 'middle',
      },
    },
    cartCheckoutButton: {
      ...theme.typography['text-cta1-m'],
    },
    viewShoppingBagButton: {
      ...theme.typography['text-cta1-m'],
    },
  }),
}
