export default {
  baseStyle: ({ theme }) => ({
    modalContentRoot: {
      width: '100%',
      maxWidth: { base: '400px', md: '600px' },
      borderRadius: 0,
      paddingTop: 'var(--spacing-12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    logo: {
      '& svg': {
        width: '200px',
        height: '36.8px',
      },
    },
    title: {
      ...theme.typography['text-display1-s'],
      fontWeight: 400, // figma is 700 but font family is already bold
      marginTop: 'var(--spacing-6)',
      marginBottom: 'var(--spacing-4)',
    },

    body: {
      ...theme.typography['text-body2-m'],
      fontWeight: '400',
      marginTop: 'var(--spacing-4)',
      margin: 'var(--spacing-6)',
      textAlign: 'center',
    },
    button: {
      ...theme.typography['text-cta1-m'],
      fontWeight: 800,
      textTransform: 'uppercase',
      margin: 'var(--spacing-6)',
      marginTop: 0,
      marginBottom: 'var(--spacing-8)',
      padding: 'var(--spacing-3) var(--spacing-6)',
      borderRadius: '2px',
      width: 'calc(100% - 48px)',
      outline: 0,
      boxShadow: 'none',
      WebkitTapHighlightColor: 'transparent',
      '&:focus, &[data-focus]': {
        boxShadow: 'none',
      },
    },
    closeButton: {
      top: 'var(--spacing-3)',
      right: 'var(--spacing-3)',
      padding: '5.5px',
      '& svg': {
        width: '13px',
        height: '13px',
      },
    },
  }),
}
