export default {
  parts: ['infoMessage', 'infoMessageContainer', 'alertIconContainer', 'infoMsgWrapper'],
  baseStyle: ({ theme }) => ({
    infoMessageContainer: {
      bg: theme.colors.neutral.light,
      mb: 'var(--spacing-4)',
      p: 'm',
    },
    alertIconContainer: {},
    infoMessage: {
      ml: 'var(--spacing-3)',
    },
    infoMsgWrapper: {
      alignItems: 'center',
    },
  }),
  variants: {
    infoMessageContainer: {
      alert: {
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
