export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 'var(--border-radius-s)',
        ...theme.typography['text-display1-s'],
        color: 'var(--color-black)',
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
      },
    }),
  }),
}
