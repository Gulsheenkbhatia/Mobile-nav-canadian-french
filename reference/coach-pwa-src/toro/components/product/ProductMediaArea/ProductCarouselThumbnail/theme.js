export default {
  baseStyle: () => ({
    cursor: 'pointer',
    maxWidth: '88px',
    mb: '5px',
  }),
  variants: {
    common: () => ({
      border: '1px solid transparent',
      opacity: 0.4,
      '&:hover': {
        opacity: 1,
      },
    }),
    carouselDisabled: () => ({
      border: `var(--border-width-s) solid var(--color-primary)`,
    }),
  },
  defaultProps: { variant: 'common' },
}
