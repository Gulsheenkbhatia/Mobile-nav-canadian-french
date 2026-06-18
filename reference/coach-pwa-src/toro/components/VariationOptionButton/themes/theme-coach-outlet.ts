export default {
  parts: ['sizeVariationButton'],
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      sizeVariationButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-cta2-xs'],
        },
      },
    }),
  },
}
