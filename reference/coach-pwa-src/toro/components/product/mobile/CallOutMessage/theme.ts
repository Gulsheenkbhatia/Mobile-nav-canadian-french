export default {
  baseStyle: () => ({
    pdpCalloutmessage: () => ({
      padding: '0',
      _first: {
        marginTop: 0,
      },
    }),
  }),
  variants: {
    underATBPromo: () => ({
      calloutMessageWrapper: {
        p: 'var(--spacing-3) var(--spacing-3) var(--spacing-4)',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        '& .pdpCallloutMessage': {
          m: '0 auto',
        },
      },
      pdpCalloutmessage: () => ({
        padding: '0',
        _first: {
          marginTop: 0,
        },
      }),
    }),
    ipx3Placement: {
      calloutMessageWrapper: {
        backgroundColor: 'var(--color-neutral-light-1)',
        p: 'var(--spacing-4) var(--spacing-3)',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        '& .pdpCallloutMessage': {
          m: '0 auto',
        },
      },
    },
  },
}
