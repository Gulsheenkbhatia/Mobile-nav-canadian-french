export default {
  parts: ['container', 'details', 'iframe'],
  baseStyle: ({ theme }) => ({
    container: {
      mt: 0,
    },
    details: {
      fontFamily: `${theme.fontFamily.primaryNormal}`,
      fontSize: 'var(--text-12)',
      color: 'var(--color-neutral-dark)',
      mr: '4px',
      '&.klarna-learn-more': {
        width: 'auto',
        minWidth: 0,
        fontWeight: 500,
        verticalAlign: 'text-bottom',
      },
    },
    iframe: {
      minHeight: '75vh',
      width: '100%',
      [`@media (max-width: ${theme.breakpoints.xl})`]: {
        minHeight: '90vh',
      },
    },
  }),
  variants: {
    'pdp-redesign': {
      details: {
        fontSize: 'var(--text-14)',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        mb: 'var(--spacing-1)',
      },
    },
  },
}
