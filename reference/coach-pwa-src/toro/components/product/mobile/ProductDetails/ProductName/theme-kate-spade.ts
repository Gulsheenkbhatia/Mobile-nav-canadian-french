export default {
  baseStyle: ({ theme }) => ({
    productNameContainer: {
      mb: 'var(--spacing-1)',
    },
    productName: {
      ...theme.typography['text-display2-s'],
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-24)',
      color: 'var(--color-black-base)',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'var(--line-height-120)',
      letterSpacing: '0.4px',
      textAlign: 'left',
    },
    productSubtitle: {
      ...theme.typography['text-title1-s'],
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-16)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-neutral-dark-1)',
      mt: '2px',
      mb: 'var(--spacing-1)',
    },
  }),
}
