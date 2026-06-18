export default {
  baseStyle: () => ({
    sizeGuideButton: {
      fontFamily: 'var(--font-face1-medium)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
      fontWeight: 500,
    },
  }),
  variants: {
    pdpV5: () => ({
      sizeGuideButton: {
        border: '0 none',
        borderRadius: '130px',
        color: 'var(--color-white-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
        fontWeight: 400,
        height: '52px',
        padding: '19px 38px',
        minWidth: 'auto',
        width: 'auto',
        whiteSpace: 'nowrap',
        '&:focus': {
          border: '0 none',
        },
      },
    }),
  },
}
