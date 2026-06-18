export default {
  parts: ['sizeVariationButton'],
  baseStyle: ({ theme }) => ({
    sizeVariationButton: {
      ...theme.typography['text-cta1-s'],
      '&.variation-size': {
        ...theme.typography['text-body1-l'],
      },
    },
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      sizeVariationButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-light-2)',
          '&.variation-size': {
            ...theme.typography['text-body1-s'],
          },
        },
      },
    }),
  },
}
