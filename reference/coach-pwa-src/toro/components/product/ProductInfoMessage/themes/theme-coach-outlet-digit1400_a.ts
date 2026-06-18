export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
      },
    },
    alertIconContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& svg': {
          width: '12px',
          height: '12px',
        },
      },
    },
    infoMessageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
        padding: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
  }),
}
