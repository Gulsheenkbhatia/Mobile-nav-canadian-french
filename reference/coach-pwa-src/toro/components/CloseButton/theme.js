export default {
  baseStyle: {},
  sizes: {
    xl: () => ({
      button: {},
      icon: {
        width: '24px', // style are applyed as props, theme variables won't work here
        height: '24px',
      },
    }),
    lg: ({ theme }) => ({
      button: {
        padding: theme.space.s,
      },
      icon: {
        width: '16px', // style are applyed as props, theme variables won't work here
        height: '16px',
      },
    }),
    md: () => ({
      button: {
        padding: '5.5px',
      },
      icon: {
        width: '13px',
        height: '13px',
      },
    }),
    sm: () => ({
      button: {
        padding: '3px',
      },
      icon: {
        width: '10px',
        height: '10px',
      },
    }),
    xs: () => ({
      button: {
        padding: '3px',
      },
      icon: {
        width: '6px',
        height: '6px',
      },
    }),
  },
  defaultProps: {
    size: 'sm',
  },
}
