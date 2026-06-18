export default {
  parts: [
    'mobileCloserlookHeading',
    'mobileCloserlookText',
    'closerLookContainer',
    'mainContainer',
    'mobileCloserlookWrapper',
    'mobileCloserlookImageWrapper',
  ],
  baseStyle: () => ({
    mainContainer: () => ({
      backgroundColor: 'var(--color-white-base)',
    }),
    closerLookContainer: {
      textAlign: 'start',
      margin: '20px var(--spacing-3) 0',
      padding: 0,
    },
    mobileCloserlookHeading: () => ({
      color: 'var(--color-primary)',
      fontWeight: 700,
      letterSpacing: 'var(--letter-spacing-xs)',
      textAlign: 'start',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-26)',
      fontStyle: 'normal',
      lineHeight: 'var(--line-height-115)',
      textTransform: 'none',
      marginBottom: '14px',
    }),
    mobileCloserlookText: () => ({
      color: 'var(--color-primary)',
      letterSpacing: 'var(--letter-spacing-xs)',
      margin: '0',
      textAlign: 'start',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-140)',
      fontStyle: 'normal',
      fontWeight: 400,
    }),

    mobileCloserlookWrapper: () => ({
      mt: '0px',
    }),

    mobileCloserlookImageWrapper: () => ({
      mt: '0px',
    }),
  }),
}
