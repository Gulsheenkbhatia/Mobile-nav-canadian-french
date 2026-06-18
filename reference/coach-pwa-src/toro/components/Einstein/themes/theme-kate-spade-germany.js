export default {
  baseStyle: ({ theme }) => ({
    einsteinTitle: {
      marginBottom: theme.space.xl,
      fontSize: theme.fontSizes.lg,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontVariationSettings: 'var(--variation-1-bold)',
      fontWeight: theme.fontWeights?.bold,
      lineHeight: theme.lineHeights.s,
      letterSpacing: theme.letterSpacings.lg,
      color: theme.colors.black,
      textAlign: 'center',
      textTransform: 'capitalize',
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        fontSize: theme.fontSizes.xlg,
      },
    },
    productName: {
      ...theme.typography['text-body2-m'],
      fontFamily: theme.fontFamily?.primaryNormal,
      paddingBottom: '2px',
    },
  }),
}
