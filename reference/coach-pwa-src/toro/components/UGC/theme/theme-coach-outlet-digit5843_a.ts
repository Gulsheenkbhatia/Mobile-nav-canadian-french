export default {
  parts: ['topContent'],
  variants: {
    pdpV3WyngMobile: () => ({
      topContent: () => ({
        h2: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-24)',
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 'var(--line-height-s)',
        },
        p: {
          fontFamily: 'var(--font-face1-normal) !important',
        },
      }),
    }),
    adaptiveTabbedPDP: () => ({
      topContent: () => ({
        h2: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-24)',
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 'var(--line-height-s)',
        },
        p: {
          fontFamily: 'var(--font-face1-normal) !important',
        },
      }),
    }),
  },
}
