export default {
  parts: ['productTitleWrapper', 'productTitle'],

  baseStyle: ({ theme, isDiscoverMode }) => ({
    productTitleWrapper: {
      m: 0,
      px: 'var(--spacing-4)',
      pt: 'var(--spacing-3)',
      pb: 'var(--spacing-2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      width: '100%',
    },

    productTitle: {
      ...(isDiscoverMode
        ? theme.typography['text-display1-s']
        : theme.typography['text-display1-l']),
      fontWeight: 400,
      textAlign: 'center',
      fontSize: isDiscoverMode ? 'var(--spacing-6)' : '36px',
      transition: 'all 0.3s ease',
    },
  }),
}
