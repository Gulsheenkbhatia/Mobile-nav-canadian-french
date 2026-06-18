export default {
  baseStyle: ({ theme }) => ({
    sizeVariationButton: {
      ...theme.typography['text-cta1-s'],
      '&.variation-size': {
        ...theme.typography['text-body1-l'],
      },
      '&.allow-disabled': {
        backgroundColor: 'var(--color-cream)',
      },
    },
  }),
}
