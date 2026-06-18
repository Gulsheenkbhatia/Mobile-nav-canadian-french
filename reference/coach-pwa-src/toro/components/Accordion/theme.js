export default {
  baseStyle: {
    button: {
      WebkitTapHighlightColor: 'transparent',
      '&:focus, &[data-focus]': {
        boxShadow: 'none',
      },
      '&:hover, &[data-hover]': {
        background: 'transparent',
      },
    },
  },
}
