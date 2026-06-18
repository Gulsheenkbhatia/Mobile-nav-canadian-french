export default {
  baseStyle: ({ theme }) => ({
    notifyMeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: theme.colors.success.primary,
        color: theme.colors.main.secondary,
        '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
        ...theme.typography['text-cta1-s'],
        h: '57px',
        borderRadius: 'var(--border-radius-s)',
        '& .notify-me-button-icon': {
          ml: '7px',
          mt: '3px',
        },
      },
    },
  }),
}
