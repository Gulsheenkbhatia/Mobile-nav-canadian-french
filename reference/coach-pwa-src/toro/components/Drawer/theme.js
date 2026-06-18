export default {
  baseStyle: ({ theme }) => ({
    dialogContainer: {
      background: theme.colors.scrim.dark,
    },
    header: {
      boxShadow: 'none',
    },
    closeButton: {
      zIndex: theme.zIndex.popover,
      '&:focus, &[data-focus]': theme.focus,
    },
  }),
  variants: {
    default: ({ theme }) => ({
      closeButton: {
        color: theme.colors.main.white,
      },
    }),
    flyout: ({ theme }) => ({
      closeButton: {
        color: theme.colors.main.black,
      },
    }),
    'add-to-cart': () => ({
      dialogContainer: {
        backgroundColor: 'transparent',
      },
    }),
    'mini-cart': () => ({
      dialogContainer: {
        backgroundColor: 'transparent',
        zIndex: 1800,
      },
    }),
  },
  sizes: {
    md: ({ theme }) => ({
      closeButton: {
        width: theme.space.l,
        height: theme.space.l,
        right: `calc(-1 * (${theme.space.mar} + ${theme.space.l}))`,
        '& svg': {
          width: theme.space.mar,
          height: theme.space.mar,
        },
      },
    }),
    lg: ({ theme }) => ({
      closeButton: {
        width: theme.space.xl,
        height: theme.space.xl,
        right: `calc(-1 * (${theme.space.s} + ${theme.space.xl}))`,
        '& svg': {
          width: theme.space.m,
          height: theme.space.m,
        },
      },
    }),
    'flyout-lg': ({ theme }) => ({
      closeButton: {
        width: theme.space.xl,
        height: theme.space.xl,
        right: theme.space.l,
        top: theme.space.l,
        '& svg': {
          width: theme.space.m,
          height: theme.space.m,
        },
      },
    }),
  },
  defaultProps: {
    variant: 'default',
    size: 'md',
  },
}
