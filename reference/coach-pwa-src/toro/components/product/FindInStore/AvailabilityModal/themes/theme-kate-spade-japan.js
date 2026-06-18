export default {
  baseStyle: ({ theme }) => ({
    input: {
      ...theme.typography['text-body1-l'],
    },
    StoreModalTitle: {
      ...theme.typography['text-display1-s'],
    },
    FindStoreLabel: {
      ...theme.typography['text-body1-m'],
      fontWeight: 500,
    },
    PlainButtonStyle: {
      ...theme.typography['text-body1-m'],
    },
    ZipCodeText: {
      ...theme.typography['text-body1-m'],
    },
  }),
}
