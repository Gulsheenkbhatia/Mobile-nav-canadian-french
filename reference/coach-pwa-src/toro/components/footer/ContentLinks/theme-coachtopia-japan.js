export default {
  baseStyle: ({ theme }) => ({
    gridItemTextMobile: {
      ...theme.typography['text-cta2-s'],
      fontFamily: 'var(--font-face1-medium)',
    },
    gridItemTextSecondaryMobile: {
      ...theme.typography['text-body2-m'],
      fontWeight: 500,
      fontFamily: 'var(--font-face1-medium)',
    },
    gridItemText: {
      ...theme.typography['text-cta1-s'],
    },
    gridItemTextSecondary: {
      ...theme.typography['text-body2-s'],
      fontFamily: 'var(--font-face1-medium)',
    },
  }),
}
