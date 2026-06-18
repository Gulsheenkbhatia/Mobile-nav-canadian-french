export default {
  baseStyle: ({ theme }) => ({
    variationAlertMessage: {
      ...theme.typography['text-body2-m'],
    },
    infoMessage: {
      ...theme.typography['text-body2-m'],
    },
    ErrorMessageContainer: () => ({
      p: '18px var(--spacing-3) var(--spacing-4)',
      background: 'var(--color-neutral-light-1)',
      '&:empty': {
        display: 'none',
      },
    }),
  }),
}
