export default {
  baseStyle: ({ theme }) => ({
    wrapper: {
      position: 'absolute',
      top: 'var(--chakra-space-2)',
      right: 'var(--chakra-space-2)',
      alignItems: 'center',
      width: '32px',
      height: '32px',
    },
    button: {
      backgroundColor: theme.colors.main.white,
      borderRadius: '50%',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      minWidth: '32px',
      height: '32px',
      minHeight: '32px',
    },
    icon: {
      width: '24px',
      height: '24px',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      wrapper: {
        display: 'flex',
        position: 'static',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        width: '100%',
      },
      button: {
        backgroundColor: theme.colors.main.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 14px 10px 12px',
        height: '36px',
        minHeight: '36px',
        width: 'auto',
        minWidth: 'auto',
        textTransform: 'none',
        gap: '6px',
        borderRadius: '130px',
        border: 'var(--border-width-s) solid rgba(0, 0, 0, 0.08)',

        '& > p': {
          fontFamily: 'HelveticaNeue53ExtendedNormal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '16px',
          letterSpacing: 'var(--letter-spacing-xs)',
        },

        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light-2) !important',
          opacity: 1,

          '& > p': {
            color: 'var(--color-neutral-medium)',
          },
        },
      },
      icon: {
        width: '19px',
        height: '19px',
      },
    }),
    plpV3OnImage: {
      wrapper: {
        display: 'flex',
        position: 'static',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        width: '100%',
      },
      button: {
        backgroundColor: 'var(--color-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 14px 10px 12px',
        height: '40px',
        minHeight: '40px',
        width: '100%',
        textTransform: 'none',
        gap: '6px',
        borderRadius: '3px',

        '& > p': {
          fontFamily: 'HelveticaNeue53ExtendedNormal',
          fontWeight: 400,
          fontSize: 'var(--text-14)',
          lineHeight: '14px',
          letterSpacing: 'var(--letter-spacing-xs)',
          paddingTop: '5px',
        },

        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light-2) !important',
          opacity: 1,

          '& > p': {
            color: 'var(--color-neutral-medium)',
          },
        },
        '&:hover:not(:disabled), &:focus-visible:not(:disabled)': {
          backgroundColor: 'var(--color-primary)',
          opacity: 1,

          '& > p': {
            color: 'var(--color-secondary)',
          },

          '& svg': {
            fill: 'var(--color-secondary)',
          },
        },
      },
      icon: {
        width: '24px',
        height: '24px',
      },
    },
    hotspotSizeDrawer: {
      wrapper: {
        display: 'flex',
        position: 'static',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',
        width: '100%',
      },
      button: {
        backgroundColor: 'var(--color-black-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 14px 10px 12px',
        height: '36px',
        minHeight: '36px',
        width: 'auto',
        minWidth: 'auto',
        textTransform: 'none',
        gap: '6px',
        borderRadius: '130px',
        border: 'var(--border-width-s) solid var(--color-neutral-light-2)',

        '& > p': {
          fontFamily: 'HelveticaNeue53ExtendedNormal',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '12px',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-white-base)',
        },

        '& svg': {
          fill: 'var(--color-white-base)',
        },

        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light-2) !important',
          opacity: 1,

          '& > p': {
            color: 'var(--color-neutral-1)',
          },
          '& svg': {
            fill: 'var(--color-neutral-1)',
          },
        },
      },
      icon: {
        width: '19px',
        height: '19px',
      },
    },
  },
}
