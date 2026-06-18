export default {
  parts: ['details', 'container', 'learnMore'],
  baseStyle: ({ theme }) => ({
    container: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-4) 0',
        display: 'flex',
        gap: '0 var(--spacing-3)',
      },
    },
    details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontSize: 'var(--text-12)',
        mb: 0,
        '&.klarna-learn-more': {
          ...theme.typography['text-badge1-xs'],
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 'var(--text-10)',
          letterSpacing: 'var(--letter-spacing-l)',
          lineHeight: 'var(--line-height-135)',
          textTransform: 'uppercase',
          fontStyle: 'normal',
          svg: {
            marginTop: '0px',
            color: 'var(--color-black-base)',
          },
        },
      },
    },
  }),
}
