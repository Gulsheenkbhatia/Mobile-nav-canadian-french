export default {
  baseStyle: ({ theme }) => ({
    container: {
      WebkitTapHighlightColor: 'transparent',
      paddingY: theme.space.xs,
      '&:not([data-disabled]):hover span[class*="__control"]': {
        borderColor: theme.colors.main.black,
        boxShadow: 'none',
      },
    },
    label: {
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
    },
  }),
  variants: {
    primary: ({ theme }) => ({
      label: {
        fontSize: theme.fontSizes.sm,
        letterSpacing: theme.letterSpacings.xs,
        lineHeight: theme.lineHeights.xl,
        '&[data-disabled]': {
          opacity: 1,
          color: theme.colors.main.inactive,
        },
      },
      control: {
        transition: '0.25s border-color ease',
        border: `1px solid ${theme.colors.main.inactive}`,
        boxShadow: 'none',
        '&[data-checked], &[data-checked]:hover': {
          backgroundColor: theme.colors.main.black,
          borderColor: theme.colors.main.black,
        },
        '&[data-disabled]': {
          backgroundColor: theme.colors.neutral.light,
        },
        '&:not([data-disabled])': {
          '&[data-invalid]': {
            borderColor: theme.colors.error.primary,
          },
        },
        '&:focus, &[data-focus]': {
          borderColor: theme.colors.main.black,
          boxShadow: 'none',
        },
      },
    }),
  },
  sizes: {
    sm: ({ theme }) => ({
      control: {
        width: theme.space.m,
        height: theme.space.m,
      },
    }),
    md: ({ theme }) => ({
      control: {
        width: theme.space.l,
        height: theme.space.l,
      },
    }),
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
}
