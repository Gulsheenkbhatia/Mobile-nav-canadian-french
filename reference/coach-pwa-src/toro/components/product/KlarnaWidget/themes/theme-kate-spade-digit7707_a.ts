export default {
  parts: ['details', 'container', 'klarnaLearnMore'],
  baseStyle: ({ theme }) => ({
    container: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-4) 0 var(--spacing-6)',
        p: 'var(--spacing-3)',
        gap: '0 var(--spacing-2)',
        display: 'flex',
        alignItems: 'center',
        bg: '#F7F7F7', //missed in design tokens
        borderRadius: 'var(--border-radius-s)',
      },
    },
    details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mr: 0,
        w: 'calc(100% - 54px)', // size of klarna logo + space between it and text
        '& .klarna-learn-more': {
          ml: 'auto',
          padding: 0,
        },
      },
    },
  }),
}
