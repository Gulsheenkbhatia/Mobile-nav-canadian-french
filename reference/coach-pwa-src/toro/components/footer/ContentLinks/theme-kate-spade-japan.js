export default {
  baseStyle: ({ theme }) => {
    return {
      gridItemText: {
        ...theme.typography['text-label1-m'],
        fontWeight: '500',
      },
      gridItemTextSecondary: {
        ...theme.typography['text-label1-m'],
      },
      gridItemTextMobile: {
        ...theme.typography['text-cta1-s'],
      },
      gridItemTextSecondaryMobile: {
        ...theme.typography['text-body1-m'],
      },
    }
  },
}
