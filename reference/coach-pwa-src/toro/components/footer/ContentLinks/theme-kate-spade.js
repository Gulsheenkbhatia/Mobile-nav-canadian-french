export default {
  baseStyle: ({ theme }) => {
    return {
      gridItemText: {
        ...theme.typography['text-eyebrow1-m'],
      },
      gridItemTextSecondary: {
        ...theme.typography['text-body2-s'],
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
