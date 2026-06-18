export default {
  baseStyle: ({ theme }) => ({
    charmsContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
      padding: 'var(--spacing-10) var(--spacing-4)',
      textAlign: 'center',
    },

    charmsTitle: {
      ...theme.typography['text-display2-m'],
      color: 'var(--color-text-primary, #111)',
      marginBottom: 'var(--spacing-2)',
    },

    charmsSubtitle: {
      ...theme.typography['text-title1-m'],
      color: 'var(--color-text-secondary, #444)',
    },
  }),
}
