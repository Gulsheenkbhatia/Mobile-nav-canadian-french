export default {
  parts: ['mobileCloserlookHeading', 'mobileCloserlookText', 'closerLookContainer'],
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      closerLookContainer: {
        m: 0,
        padding: '20px var(--spacing-3) 2px',
      },
      mobileCloserlookHeading: () => ({
        ...theme.typography['text-display1-m'],
        color: 'var(--color-black-base)',
        fontWeight: 'normal',
        textAlign: 'start',
        marginBottom: '13px',
      }),
      mobileCloserlookText: () => ({
        ...theme.typography['text-body2-m'],
        margin: '0',
        textAlign: 'start',
        fontWeight: 500,
      }),
    }),
  },
}
