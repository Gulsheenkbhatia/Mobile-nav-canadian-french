export default {
  baseStyle: ({ theme }) => ({
    totalProductsCount: {
      ...theme.typography['text-body2-m'],
    },
    clearAllStyles: {
      ...theme.typography['text-body2-s'],
      color: theme.colors.main.primary,
      borderRadius: 0,
      borderBottomWidth: 'var(--border-width-s)',
      borderBottomColor: theme.colors.main.primary,
      '&:hover:not(:disabled), &:active': {
        color: theme.colors.neutral.medium,
        borderBottomColor: theme.colors.main.gray,
      },
    },
    activeFiltersStyles: {
      ...theme.typography['text-body2-s'],
      '&:not(:last-child)': {
        marginRight: theme.space.s,
      },
    },
  }),
}
