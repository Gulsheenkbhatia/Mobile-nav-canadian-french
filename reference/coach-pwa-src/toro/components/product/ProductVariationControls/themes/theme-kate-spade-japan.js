export default {
  baseStyle: ({ theme }) => ({
    variationLabelText: {
      ...theme.typography['text-body1-m'],
    },
    variationLabelValue: {
      ...theme.typography['text-body1-m'],
    },
    colorVariantLabel: {
      marginBottom: 'var(--spacing-2)',
    },
    showMoreShowLessWrapper: {
      background: 'var(--color-cream)',
    },
    showMoreShowLessText: {
      ...theme.typography['text-body1-m'],
    },
    fitReviewText: () => ({}),
  }),
}
