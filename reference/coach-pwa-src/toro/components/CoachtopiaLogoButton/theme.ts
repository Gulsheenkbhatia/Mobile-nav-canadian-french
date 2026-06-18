export default {
  baseStyle: () => ({
    wrapper: {
      alignItems: 'center',
      gap: 'var(--spacing-4)',
      hr: {
        height: '32px',
        borderColor: 'var(--color-neutral-light-2)',
      },
    },
    link: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      padding: '6px 7px',
      height: '26px',
    },
  }),
  variants: {
    hp: {
      wrapper: {
        py: 'var(--spacing-2)',
      },
    },
    plp: {
      wrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        hr: {
          height: 0,
        },
      },
      link: {
        margin: 'var(--spacing-3) var(--spacing-4)',
      },
    },
    pdp: {
      wrapper: {
        position: 'absolute',
        top: '59px',
        zIndex: 1,
      },
    },
  },
}
