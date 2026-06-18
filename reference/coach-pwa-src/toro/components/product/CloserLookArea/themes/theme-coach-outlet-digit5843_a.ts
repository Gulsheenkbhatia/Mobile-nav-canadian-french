export default {
  baseStyle: ({ theme }) => ({
    mainContainer: () => ({
      backgroundColor: '',
      marginBottom: '20px',
    }),
    closerLookContainer: {
      textAlign: 'start',
      margin: '20px var(--spacing-3) 0',
    },
    mobileCloserlookHeading: () => ({
      ...theme.typography['text-display4-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-primary)',
      fontSize: 'var(--text-24)',
      fontWeight: 700,
      lineHeight: 'var(--line-height-120)',
      letterSpacing: 'var(--letter-spacing-s)',
      textAlign: 'start',
    }),
    mobileCloserlookText: () => ({
      ...theme.typography['text-body1-m'],
      color: 'var(--color-primary)',
      fontSize: 'var(--text-14)',
      fontFamily: 'var(--font-face1-normal)',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      margin: 'var(--spacing-3) 0 0',
      textAlign: 'start',
    }),
    mobileCloserlookImageWrapper: () => ({
      marginTop: '0px',
    }),
    mobileCloserlookWrapper: () => ({
      marginTop: '0px',
    }),
  }),
}
