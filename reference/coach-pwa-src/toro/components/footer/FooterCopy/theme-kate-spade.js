export default {
  baseStyle: ({ theme }) => {
    return {
      footerCopyText: {
        ...theme.typography['text-eyebrow1-m'],
        '.copyright': {
          ...theme.typography['text-eyebrow1-m'],
        },
      },
    }
  },
}
