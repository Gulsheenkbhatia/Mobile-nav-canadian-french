export default {
  baseStyle: ({ theme }) => ({
    pdpCalloutmessage: () => ({
      '*': {
        ...theme.typography['text-body1-s'],
      },
      fontWeight: 500,
      color: 'var(--color-primary)',
      marginBottom: 'var(--spacing-1)',
    }),
  }),
}
