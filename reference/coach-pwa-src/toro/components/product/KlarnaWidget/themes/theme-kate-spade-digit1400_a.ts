export default {
  parts: ['details', 'container', 'learnMore'],
  baseStyle: ({ theme }) => ({
    container: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-4) 0',
      },
    },
    details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        fontWeight: 400,
        fontStyle: 'normal',
        '&.klarna-learn-more': {
          ...theme.typography['text-badge1-xs'],
          textDecoration: 'none',
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 500,
          svg: {
            marginTop: '1px',
          },
        },
      },
    },
  }),
}
