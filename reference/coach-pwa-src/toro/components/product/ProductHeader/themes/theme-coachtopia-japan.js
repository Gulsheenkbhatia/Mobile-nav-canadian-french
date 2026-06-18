export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      mb: 'var(--border-radius-s)',
      ...theme.typography['text-display1-s'],
      fontWeight: 800,
      color: 'var(--color-black)',
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'var(--font-face1-extrabold)',
    }),
  }),
}
