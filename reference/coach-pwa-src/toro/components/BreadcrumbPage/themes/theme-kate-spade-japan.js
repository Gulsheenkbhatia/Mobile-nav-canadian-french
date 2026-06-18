export default {
  baseStyle: ({ theme }) => ({
    breadcrumbLink: () => ({
      ...theme.typography['text-body2-s'],
    }),
    breadcrumbText: {
      fontWeight: '500',
    },
    separator: {
      '*': {
        ...theme.typography['text-body2-s'],
      },
    },
  }),
}
