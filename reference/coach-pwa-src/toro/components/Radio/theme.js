export default {
  baseStyle: ({ theme }) => ({
    control: {
      border: `1px solid ${theme.colors.main.black}`,
      backgroundColor: theme.colors.main.white,
      '&:focus, &[data-focus]': theme.focus,
      '&[data-checked]': {
        backgroundColor: theme.colors.main.white,
        borderColor: theme.colors.main.black,
        '&:hover, &[data-hover]': {
          backgroundColor: theme.colors.main.white,
          borderColor: theme.colors.main.black,
        },
        '&:before': {
          width: theme.space.mar,
          height: theme.space.mar,
          backgroundColor: theme.colors.main.black,
          borderColor: theme.colors.main.black,
        },
      },
    },
  }),
  sizes: {
    lg: ({ theme }) => ({
      control: {
        width: theme.space.l,
        height: theme.space.l,
      },
    }),
  },
}
