export default {
  baseStyle: ({ theme }) => ({
    gridItemTextMobile: {
      ...theme.typography['text-cta2-s'],
    },
    gridItemTextSecondaryMobile: {
      ...theme.typography['text-body2-m'],
      fontWeight: 500,
    },
    gridItemText: {
      ...theme.typography['text-cta1-s'],
      fontWeight: 'inherit',
    },
    gridItemTextSecondary: {
      ...theme.typography['text-body2-s'],
    },
  }),
}
