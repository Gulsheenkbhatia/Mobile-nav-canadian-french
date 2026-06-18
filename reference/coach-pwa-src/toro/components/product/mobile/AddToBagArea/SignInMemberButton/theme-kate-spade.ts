export default {
  baseStyle: ({ theme }) => ({
    memberWrapper: {
      mb: 0,
      minWidth: '100%',
      height: '100%',
      transition: 'all 400ms ease',
    },
    signInBtnStyle: {
      display: 'flex',
      flexGrow: 1,
      height: '58px',
      padding: '21px var(--spacing-10) 20px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      backgroundColor: 'var(--color-black-base, #000)',
      borderRadius: 'var(--border-radius-m)',
      transition: 'all 400ms ease',
    },
    iconWrapper: {
      m: 0,
    },
    signInText: {
      ...theme.typography['text-body2-l'],
      fontSize: 'var(--text-16)',
      transition: 'all 400ms ease',
      color: 'var(--color-white-base)',
      textTransform: 'lowercase',
      position: 'relative',
      top: '2px',
      '&:first-letter': {
        textTransform: 'uppercase',
      },
    },
  }),
}
