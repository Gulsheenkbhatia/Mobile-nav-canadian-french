export default {
  baseStyle: {
    fontWeight: 500,
    letterSpacing: 'var(--letter-spacing-xs)',
    lineHeight: 'var(--line-height-l)',
  },
  variants: {
    primary: {
      color: 'var(--color-primary)',
    },
    secondary: {
      fontFamily: 'var(--font-serif-regular)',
      color: 'var(--color-black-base)',
    },
    white: {
      color: 'var(--color-white-base)',
    },
  },
  sizes: {
    h1: {
      fontSize: 'var(--font-size-heading-lg)',
    },
    h2: {
      fontSize: 'var(--font-size-heading-md)',
    },
    h3: {
      fontSize: 'var(--text-24)',
    },
    h4: {
      fontSize: 'var(--font-size-heading-xs)',
    },
    h5: {
      fontSize: 'var(--text-32)',
    },
    h6: {
      fontSize: 'var(--text-24)',
    },
  },
  defaultProps: {
    level: '1',
  },
}
