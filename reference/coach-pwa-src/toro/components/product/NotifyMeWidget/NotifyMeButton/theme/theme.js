export default {
  baseStyle: ({ theme }) => ({
    notifyMeButton: {
      color: theme.colors.main.secondary,
      '&.bundle-variant-notify-me': {
        color: theme.colors.main.black,
      },
      '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
    },
  }),
  variants: {
    tabbedPDP: ({ theme }) => ({
      notifyMeButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta1-s'],
          fontSize: 'var(--text-12)',
          mt: 'var(--spacing-2)',
          height: '48px',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      notifyMeButtonWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          flex: 1,
          width: 'unset',
          minWidth: '50%',
        },
      },
      notifyMeButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          backgroundColor: 'var(--color-white-base)',
          color: 'var(--color-black-base)',
          letterSpacing: 'var(--letter-spacing-xs)',
          borderRadius: '0',
          height: '56px',
          textTransform: 'none',
          flexDirection: 'row-reverse',
          lineHeight: 1,
          paddingTop: '20px',
        },
      },
    }),
    plp: ({ theme }) => ({
      notifyMeButtonWrapper: {
        display: 'flex',
        position: 'static',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        width: '100%',
      },
      notifyMeButton: {
        backgroundColor: 'var(--color-white-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 28px 10px 28px',
        height: '36px',
        minHeight: '36px',
        width: 'auto',
        minWidth: 'auto',
        textTransform: 'none',
        gap: '6px',
        borderRadius: '130px',
        border: 'var(--border-width-s) solid rgba(0, 0, 0, 0.08)',
        fontFamily: 'HelveticaNeue53ExtendedNormal',
        fontWeight: 400,
        fontSize: 'var(--text-10)',
        lineHeight: '16px',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: '0px',
          height: '36px',
        },
      },
    }),
  },
}
