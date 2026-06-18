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
    'checkoutButtonVariant',
    'viewBagButtonVariant',
  ],
  baseStyle: ({ theme }) => ({
    myBagHeader: {
      ...theme.typography['text-display1-s'],
    },
    miniCartProductName: {
      ...theme.typography['text-body2-m'],
    },
    miniCartProductdetail: {
      ...theme.typography['text-eyebrow1-m'],
    },
    mainPrice: {
      ...theme.typography['text-body2-m'],
    },
    discountPrice: (priceColor) => ({
      color: priceColor,
      ...theme.typography['text-body2-m'],
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
    viewBagButtonVariant: {
      variant: 'primary',
    },
    checkoutButtonVariant: {
      variant: 'secondary',
    },
    cartButtonsMainWrapper: {
      display: 'flex',
      flexDirection: 'column',
      px: 'l',
      py: 'l',
      bg: theme.colors.main.white,
      boxShadow: theme.boxShadow.miniCartPopover,

      '@media (max-width: 768px)': {
        px: '20px',
      },
    },
    cartButtonsWrapper: {
      mb: 0,
      order: 2,
    },
    viewShoppingBagButtonWrapper: {
      mb: 'mar',
    },
  }),
}
