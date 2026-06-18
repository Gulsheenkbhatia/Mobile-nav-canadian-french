export default {
  baseStyle: ({ theme }) => ({
    root: {
      fontFamily: 'var(--font-face1-medium)',
    },
    cardTitle: () => ({
      ...theme.typography['text-body2-s'],
      fontSize: 'var(--text-12)',
      marginBottom: 'var(--spacing-6)',
      letterSpacing: 'var(--letter-spacing-s)',
      fontFamily: 'var(--font-face1-extrabold)',
    }),
  }),
}
