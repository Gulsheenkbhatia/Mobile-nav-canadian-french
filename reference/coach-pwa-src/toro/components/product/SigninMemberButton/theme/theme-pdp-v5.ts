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
      maxWidth: '408px',
      maxHeight: '64px',
      height: '100%',
      padding: 'var(--spacing-3) var(--spacing-6)',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      borderRadius: '800px',
      background: 'var(--color-black-base)',
      transition: 'all 400ms ease',
    },
    iconWrapper: {
      m: 0,
    },
    signInText: {
      ...theme.typography['text-cta2-m'],
      fontSize: 'var(--text-12)',
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
