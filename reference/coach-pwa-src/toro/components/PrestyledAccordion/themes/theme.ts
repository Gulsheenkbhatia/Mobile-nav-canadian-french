export default {
  parts: [
    'rootWrapper',
    'wrapper',
    'title',
    'accordionWrapper',
    'accordionItem',
    'button',
    'buttonText',
    'icon',
    'panel',
  ],
  baseStyle: ({ theme }) => ({
    wrapper: {
      padding: '60px 30px 30px',
      margin: '0 auto',
      width: '68%',
      display: 'flex',
      flexDirection: 'column',
    },
    title: { ...theme.typography['text-display1-l'], marginBottom: '44px' },
    accordionWrapper: {},
    accordionItem: {
      borderTop: '1px solid var(--color-neutral-inactive)',
      padding: '17px 0',
      '&:last-of-type': {
        borderBottom: '1px solid var(--color-neutral-inactive)',
      },
    },
    button: {
      p: 0,
      justifyContent: 'space-between',
      textAlign: 'left',
    },
    buttonText: {
      ...theme.typography['text-body1-l'],
    },
    icon: {
      width: '24px',
      height: '24px',
    },
    panel: { p: 0, m: '0 0 18px' },
  }),
  variants: {
    pdpv6: ({ theme }) => ({
      rootWrapper: {
        backgroundColor: 'var(--color-neutral-light-1)',
        padding: '10px',
      },
      wrapper: {
        padding: '30px 10px var(--spacing-6)',
        borderRadius: 'var(--border-radius-m)',
        backgroundColor: 'var(--color-white-base)',
        w: 'auto',
      },
      title: { ...theme.typography['text-display4-s'], marginBottom: '20px' },
      accordionItem: {
        borderTop: '1px solid var(--color-neutral-light-2)',
        padding: '20px 0',
        '&:last-of-type': {
          borderBottom: '1px solid var(--color-neutral-light-2)',
        },
      },
      buttonText: { ...theme.typography['text-display4-xxs'] },
      panel: { p: 0, m: '10px 0 0' },
    }),
  },
}
