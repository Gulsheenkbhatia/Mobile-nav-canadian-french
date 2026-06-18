export default {
  baseStyle: ({ theme }) => ({
    benefitsContainer: {
      padding: '0 0 0 var(--spacing-3)',
      marginBottom: '20px',
    },
    benefitsTitle: {
      ...theme.typography['text-body1-m'],
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.xl,
      letterSpacing: theme.letterSpacings.xs,
      marginBottom: '2px',
    },
    benefitText: () => ({
      ...theme.typography['text-body1-l'],
      fontSize: theme.fontSizes.md,
      lineHeight: theme.lineHeights.lg,
      letterSpacing: theme.letterSpacings.xs,
    }),
    benefitsItemsWrapper: {
      pr: theme.space.mar,
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none' /* IE and Edge */,
      'scrollbar-width': 'none' /* Firefox */,
    },
  }),
}
