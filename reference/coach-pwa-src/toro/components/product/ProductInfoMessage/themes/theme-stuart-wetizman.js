export default {
  parts: ['infoMessage', 'infoMessageContainer', 'alertIconContainer'],
  baseStyle: ({ theme }) => ({
    infoMessage: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-neutral-dark)',
    },
    infoMessageContainer: {
      mb: 'var(--spacing-8)',
    },
  }),
  variants: {
    infoMessageContainer: {
      alert: {
        mb: 'var(--spacing-4)',
        p: 'mar',
      },
    },
    alertIconContainer: () => ({
      alert: {
        mr: 'mar',
        mt: 'xs',
      },
    }),
  },
}
