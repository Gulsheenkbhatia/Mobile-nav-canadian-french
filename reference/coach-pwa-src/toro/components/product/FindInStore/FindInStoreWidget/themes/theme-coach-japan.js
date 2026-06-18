export default {
  parts: ['ProductTitle', 'ProductInfoStyle'],
  baseStyle: ({ theme }) => ({
    findAStoreButton: {
      ...theme.typography['text-cta1-m'],
    },
    ProductTitle: {
      ...theme.typography['text-body2-l'],
    },
    ProductInfoStyle: {
      ...theme.typography['text-eyebrow1-m'],
    },
    ViewBuisnessHour: {
      ...theme.typography['text-body1-s'],
    },
    StoreAddress: {
      ...theme.typography['text-body1-m'],
    },
    StoreName: {
      ...theme.typography['text-display1-xs'],
    },
    FindInStoreWrapper: {
      mb: 'var(--spacing-6)',
    },
  }),
}
