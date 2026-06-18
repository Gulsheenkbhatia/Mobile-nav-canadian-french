export default {
  baseStyle: ({ theme }) => ({
    notifyMeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-l'],
        fontSize: 'var(--text-16)',
        color: 'var(--color-black-base)',
        backgroundColor: 'var(--color-secondary, #FFFFFE)',
        '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
        h: '58px',
        borderRadius: 'var(--border-radius-s)',
        textTransform: 'none',
        '& .notify-me-button-icon': {
          ml: 0,
          mr: '6px',
          mt: 0,
        },
      },
      flexDirection: 'row-reverse',
      padding: '21px var(--spacing-10) 20px',
    },
  }),
}
