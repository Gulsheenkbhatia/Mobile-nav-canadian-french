export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ml: 0,
        fontSize: 'var(--text-12)',
      },
    },
    alertIconContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mr: 'var(--spacing-2)',
        '& svg': {
          width: '12px',
          height: '12px',
        },
      },
    },
    infoMessageContainer: {
      p: 'var(--spacing-4) var(--spacing-3)',
    },
  }),
}
