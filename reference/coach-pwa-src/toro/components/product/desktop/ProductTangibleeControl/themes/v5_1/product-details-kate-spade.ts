export default {
  parts: ['tangibleWrapper', 'tangibleeTitle'],
  variants: {
    vpc: () => ({
      tangibleWrapper: () => ({
        height: '52px',
        padding: '19px 38px',
        minWidth: 'auto',
        whiteSpace: 'nowrap',
      }),
      tangibleeTitle: () => ({
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
        fontWeight: '400',
        textTransform: 'none',
      }),
    }),
  },
}
