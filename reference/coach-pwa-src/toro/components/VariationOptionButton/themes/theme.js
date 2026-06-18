export default {
  parts: ['sizeVariationButton'],
  baseStyle: ({ theme }) => ({
    sizeVariationButton: {
      fontSize: theme.fontSizes.xs,
      '&.variation-size': {
        fontSize: theme.fontSizes.sm,
      },
    },
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      sizeVariationButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: 1,
          borderRadius: '40px',
          height: '48px',
          padding: '18px var(--spacing-4)',
          '&.variation-size': {
            fontSize: theme.fontSizes.xs,
          },
          '&:after': {
            borderRadius: '40px',
          },
        },
      },
    }),
  },
}
