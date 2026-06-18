export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontWeight: 325,
        color: 'var(--color-black-base)',
      },
    },
    infoMessageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
        padding: 'var(--spacing-4) var(--spacing-3)',
      },
    },
  }),
}
