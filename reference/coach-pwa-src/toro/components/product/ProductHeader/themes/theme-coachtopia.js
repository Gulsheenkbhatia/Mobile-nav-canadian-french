export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      mb: 'var(--border-radius-s)',
      ...theme.typography['text-display1-s'],
      color: 'var(--color-black)',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'var(--chakra-fontWeights-normal)',
    }),
  }),
}
