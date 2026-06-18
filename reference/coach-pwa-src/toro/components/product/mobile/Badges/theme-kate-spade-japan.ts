export default {
  baseStyle: {},
  variants: {
    lowInventoryAboveATB: ({ theme }) => ({
      ...theme.typography['text-body1-m'],
      fontWeight: '500',
      textTransform: 'none',
      display: 'flex',
      marginBottom: 'var(--spacing-1)',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: 'var(--spacing-2)',
      borderRadius: 'var(--spacing-2)',
      textAlign: 'center',
      justifyContent: 'center',
      color: 'var(--color-sale)',
    }),
  },
}
