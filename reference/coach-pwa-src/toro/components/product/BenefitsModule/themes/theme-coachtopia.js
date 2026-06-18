export default {
  parts: ['benefitsTitle', 'benefitText', 'benefitItem'],
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      benefitsTitle: {
        ...theme.typography['text-body1-m'],
        marginBottom: 'var(--spacing-1)',
      },
      benefitItem: {
        gap: 'var(--spacing-2)',
      },
      benefitText: () => ({
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }),
    }),
  },
}
