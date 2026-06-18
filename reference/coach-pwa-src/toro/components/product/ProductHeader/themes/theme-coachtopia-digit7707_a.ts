export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontSize: 'var(--text-16)',
        color: 'var(--color-black-base)',
        mb: 'var(--spacing-1)',
      },
    }),
  }),
}
