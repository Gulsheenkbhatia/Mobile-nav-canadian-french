export default {
  baseStyle: ({ theme }) => ({
    filterButtonText: {
      ...theme.typography['text-cta1-xs'],
      color: theme.colors.main.primary,
    },
    mobileFilterButton: {
      paddingLeft: 'var(--spacing-2)',
      paddingRight: 'var(--spacing-2)',
      borderColor: 'var(--border-color-neutral-base)',
    },
    sortByText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    viewResultButton: {
      ...theme.typography['text-cta1-s'],
    },
  }),
}
