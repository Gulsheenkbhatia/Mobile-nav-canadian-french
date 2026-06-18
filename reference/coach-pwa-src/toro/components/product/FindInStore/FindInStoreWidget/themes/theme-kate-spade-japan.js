export default {
  parts: ['findAStoreButton', 'ProductTitle', 'ProductInfoStyle'],
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
    SelectBoutique: {
      ...theme.typography['text-cta1-s'],
    },
    StoreName: {
      ...theme.typography['text-display1-xs'],
    },
    FindInStoreWrapper: {
      marginBottom: 'var(--spacing-6)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '0',
      },
    },
  }),
}
