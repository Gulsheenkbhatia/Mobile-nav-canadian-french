export default {
  parts: ['infoMessage', 'infoMessageContainer', 'alertIconContainer'],
  baseStyle: ({ theme }) => ({
    infoMessage: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-neutral-dark)',
      fontStyle: 'italic',
    },
  }),
}
