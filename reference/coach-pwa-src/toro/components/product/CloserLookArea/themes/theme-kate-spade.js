export default {
  baseStyle: ({ theme }) => ({
    mainContainer: () => ({
      backgroundColor: '',
    }),
    closerLookHeading: {
      ...theme.typography['text-display2-xl'],
    },
    closerLookText: {
      ...theme.typography['text-body1-m'],
    },
    mobileCloserlookHeading: () => ({
      ...theme.typography['text-display2-s'],
    }),
    mobileCloserlookText: () => ({
      ...theme.typography['text-body1-m'],
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      closerLookContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-12)',
          marginRight: 'var(--spacing-3)',
          marginBottom: '20px',
          marginLeft: 'var(--spacing-3)',
        },
      },
      mobileCloserlookHeading: () => ({
        ...theme.typography['text-display1-m'],
        fontSize: 'var(--text-28)',
        color: 'var(--color-primary)',
      }),

      mobileCloserlookText: () => ({
        ...theme.typography['text-body1-m'],
        color: 'var(--color-black-base)',
        marginTop: 'var(--spacing-2)',
        marginLeft: 0,
        marginRight: 0,
      }),
    }),
  },
}
