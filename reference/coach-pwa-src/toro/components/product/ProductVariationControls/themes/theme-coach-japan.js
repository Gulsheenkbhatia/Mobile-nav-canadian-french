export default {
  parts: ['variationLabelText', 'variationLabelValue', 'colorVariantLabel'],
  baseStyle: ({ theme }) => ({
    variationLabelText: {
      textTransform: 'uppercase',
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: 500,
      lineHeight: theme.lineHeights.xxl,
      letterSpacing: theme.letterSpacings.md,
    },
    variationLabelValue: {
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: 500,
      lineHeight: theme.lineHeights.xxl,
      letterSpacing: theme.letterSpacings.md,
    },
    colorVariantLabel: {
      marginBottom: 'var(--spacing-2)',
    },
    fitReviewText: () => ({}),
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      variationLabelText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 'var(--spacing-2)',
        },
      },
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.controls-btn-tabs-child': {
            flex: 'none',
          },
        },
      },
    }),
  },
}
