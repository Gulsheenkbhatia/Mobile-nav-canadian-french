export default {
  baseStyle: ({ theme }) => ({
    separator: {
      '& *': {
        ...theme.typography['text-body2-s'],
      },
    },
    breadcrumbs: {
      fontFamily: 'var(--font-face1-medium)',
    },
  }),
}
