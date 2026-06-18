export default {
  parts: ['details', 'container'],
  baseStyle: ({ theme }) => ({
    container: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '17px',
        marginBottom: '10px',
      },
    },
    details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-xl)',
        fontSize: 'var(--text-12)',
        '&.klarna-learn-more': {
          ...theme.typography['text-badge1-xs'],
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 'var(--text-10)',
          letterSpacing: 'var(--letter-spacing-xl)',
          lineHeight: 1,
          textTransform: 'uppercase',
          svg: {
            display: 'inline-block',
            marginTop: '-2px',
          },
        },
      },
    },
  }),
}
