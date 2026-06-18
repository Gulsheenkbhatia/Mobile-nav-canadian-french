export default {
  parts: ['quickViewSignInTextStyle', 'signInBtnStyle', 'memberWrapper', 'iconWrapper'],
  baseStyle: () => ({
    quickViewSignInTextStyle: {
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: '1.4',
      m: 'auto 0',
    },
    memberWrapper: {
      marginBottom: 'var(--spacing-3)',
    },
    iconWrapper: {
      marginRight: 'var(--spacing-2)',
    },
  }),
  variants: {
    plpV3OnImage: ({ theme }) => ({
      memberWrapper: {
        marginBottom: 0,
      },
      iconWrapper: {
        marginRight: 'var(--spacing-1)',
        marginBottom: 'var(--spacing-1)',
      },
      signInBtnStyle: {
        ...theme.typography['text-cta2-s'],
        backgroundColor: 'var(--color-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-3) var(--spacing-2) var(--spacing-2)',
        height: 'var(--spacing-10)',
        minHeight: 'var(--spacing-10)',
        width: '100%',
        borderRadius: '3px',
        textTransform: 'none',
        textWrap: 'wrap',

        color: 'var(--color-black-base)',

        '& svg': {
          fill: 'var(--color-black-base)',
          width: '16px',
          height: '16px',
        },
        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light-2)',
          color: 'var(--color-neutral-base)',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-secondary)',

          '& svg': {
            fill: 'var(--color-secondary)',
          },
        },
      },
    }),
    pdpV41: () => ({
      memberWrapper: {
        marginBottom: 0,
      },
      signInBtnStyle: {
        height: '100%',
      },
    }),
  },
}
