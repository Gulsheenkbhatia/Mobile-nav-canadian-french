export default {
  baseStyle: ({ theme }) => ({
    pdpCalloutmessage: () => ({
      '*': {
        ...theme.typography['text-body1-s'],
      },
      color: 'var(--color-primary)',
      _first: {
        marginTop: theme.space.s,
      },
    }),
    plpCalloutmessage: {
      textAlign: 'center',
      span: {
        ...theme.typography['text-eyebrow1-m'],
      },
    },
  }),
  variants: {
    plpV3: () => ({
      plpCalloutmessage: {
        textAlign: 'center',
      },
    }),
  },
}
