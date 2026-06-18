export const variants = {
  unstyled: {
    '&:hover': {
      textDecoration: 'none',
    },
    '&:focus': {
      boxShadow: 'none',
      WebkitTapHighlightColor: 'transparent !important',
    },
  },
  underline: {
    textDecoration: 'underline',
  },
}

export default {
  baseStyle: () => ({
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent !important',
    '&:focus-visible': {
      boxShadow: 'var(--chakra-shadows-outline) !important', // Chakra disables :focus-visible outline on links
      WebkitTapHighlightColor: 'transparent !important',
    },
  }),
  variants,
}
