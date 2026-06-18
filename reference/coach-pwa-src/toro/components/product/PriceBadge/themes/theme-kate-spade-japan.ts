export default {
  parts: ['PriceBadgeWrapper'],
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      PriceBadgeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          margin: 'var(--spacing-1) 0',
        },
      },
    }),
  },
}
