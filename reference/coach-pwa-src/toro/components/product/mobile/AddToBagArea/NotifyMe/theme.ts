export default {
  baseStyle: ({ theme }) => ({
    notifyMeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-cta2-s'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        backgroundColor: 'var(--color-secondary, #FFFFFE)',
        '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
        h: '58px',
        borderRadius: 'var(--border-radius-s)',
        textTransform: 'none',
        mt: 0,
        '& .notify-me-button-icon': {
          m: '0 2px 3px 0',
        },
      },
      flexDirection: 'row-reverse',
      padding: '21px var(--spacing-10) 20px',
    },
  }),
}
