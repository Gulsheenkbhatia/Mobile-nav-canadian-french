export default {
  parts: [
    'rootWrapper',
    'wrapper',
    'title',
    'accordionWrapper',
    'accordionItem',
    'button',
    'buttonText',
    'icon',
    'panel',
  ],
  variants: {
    pdpv6: ({ theme }) => ({
      title: { ...theme.typography['text-display2-m'] },
      buttonText: { ...theme.typography['text-display2-s'] },
    }),
    pdpv5_1: () => ({
      wrapper: {
        margin: '0 auto 60px',
      },
      title: {
        fontFamily: 'var(--font-face2-normal)',
        fontSize: '52px',
        fontWeight: 400,
        lineHeight: 'var(--line-height-115)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textAlign: 'center',
      },
      buttonText: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
    }),
  },
}
