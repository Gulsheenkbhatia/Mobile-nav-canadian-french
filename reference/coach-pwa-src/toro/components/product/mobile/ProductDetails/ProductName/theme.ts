export default {
  baseStyle: ({ theme }) => ({
    productNameContainer: {
      mb: 'var(--spacing-1)',
    },
    productName: {
      ...theme.typography['text-display4-xxs'],
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-16)',
      color: 'var(--color-black-base)',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'var(--line-height-120)',
      letterSpacing: '0.4px',
      textAlign: 'left',
    },
    productSubtitle: {
      ...theme.typography['text-title1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-neutral-dark-1)',
      textAlign: 'left',
      mt: '2px',
      mb: 'var(--spacing-1)',
    },
  }),
}
