export default {
  baseStyle: ({ theme }) => ({
    field: {
      fontFamily: theme.fontFamily.primaryNormal,
    },
  }),
  variants: {
    primary: ({ theme }) => ({
      field: {
        width: 'auto',
        padding: `${theme.space.mar}  ${theme.space.m}`,
        minHeight: theme.space.xxl, // height is overridden by Chakra, so we use minHeight
        lineHeight: theme.lineHeights.xxl,
        fontSize: theme.fontSizes.md,
        letterSpacing: theme.letterSpacings.xs,
        border: `1px solid ${theme.colors.main.inactive}`,
        borderRadius: '2px',
        '&:active, &:focus': {
          borderColor: theme.colors.main.black,
        },
        '&[disabled]': {
          backgroundColor: theme.colors.neutral.light,
          color: theme.colors.neutral.base,
        },
      },
    }),
  },
  sizes: {},
  defaultProps: {
    variant: 'primary',
  },
}
