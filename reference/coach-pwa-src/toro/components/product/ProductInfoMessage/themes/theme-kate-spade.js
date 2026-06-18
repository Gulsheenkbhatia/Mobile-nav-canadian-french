export default {
  parts: ['infoMessage', 'infoMessageContainer', 'alertIconContainer'],
  baseStyle: ({ theme }) => ({
    infoMessage: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-neutral-dark)',
    },
    infoMessageContainer: {
      bg: 'var(--color-cream)',
    },
    infoMsgWrapper: {
      alignItems: 'flex-end',
    },
    alertIconContainer: {
      alignSelf: 'self-start',
    },
  }),
}
