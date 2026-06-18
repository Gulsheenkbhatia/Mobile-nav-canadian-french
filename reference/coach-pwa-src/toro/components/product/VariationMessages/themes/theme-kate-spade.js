export default {
  baseStyle: ({ theme }) => ({
    variationAlertMessage: {
      ...theme.typography['text-body1-m'],
      background: 'var(--border-color-cream)',
    },
    infoMessage: {
      ...theme.typography['text-body1-m'],
    },
    ErrorMessageContainer: () => ({
      mt: 'var(--spacing-4)',
    }),
  }),
}
