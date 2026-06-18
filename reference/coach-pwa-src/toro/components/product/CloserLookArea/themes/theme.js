export default {
  parts: [
    'mobileSkeletonHeader',
    'desktopSkeletonHeader',
    'closerLookSkeletonWrapper',
    'skeleton',
    'desktopCloserlookWrapper',
    'mainContainer',

    'closerLookWrapper',
    'closerLookImageWrapper',
    'closerLookDescWrapper',
    'closerLookHeading',
    'closerLookText',

    'mobileCloserlookWrapper',
    'mobileCloserlookImageWrapper',
    'mobileCloserlookDescWrapper',
    'mobileCloserlookHeading',
    'mobileCloserlookText',
  ],
  baseStyle: ({ theme }) => ({
    mainContainer: () => ({
      backgroundColor: '',
    }),
    mobileSkeletonHeader: {
      mt: '22px',
      mb: '22px',
    },
    desktopSkeletonHeader: {
      mr: '32px',
      ml: '32px',
      mt: '200px',
      mb: '40px',
    },
    closerLookSkeletonWrapper: {
      m: '42px',
    },
    skeleton: {
      mb: 'mar',
    },
    desktopCloserlookWrapper: {
      mr: '10%',
      mt: '40px',
      mb: '40px',
      ml: '10%',
    },
    closerLookWrapper: {
      ml: '-12px',
      mr: '-12px',
    },
    closerLookImageWrapper: {
      mt: '48px',
    },
    closerLookDescWrapper: {
      mt: '170px',
      mr: '55px',
    },
    closerLookHeading: {
      mb: '6px',
      lineHeight: theme.lineHeights.xl,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
    },
    closerLookText: {
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: theme.lineHeights.sm,
    },
    mobileCloserlookWrapper: () => ({
      mt: '10px',
      w: '100%',
    }),
    mobileCloserlookImageWrapper: () => ({
      mt: '48px',
    }),
    mobileCloserlookDescWrapper: {
      mt: '30px',
      mb: '20px',
    },
    mobileCloserlookHeading: () => ({
      lineHeight: theme.lineHeights.md,
      fontFamily: theme.fontFamily.secondaryNormal,
      textAlign: 'center',
    }),
    mobileCloserlookText: () => ({
      fontSize: 'sm',
      fontFamily: theme.fontFamily.secondaryNormal,
      m: '15px 24px 0px 22px',
      fontWeight: 'normal',
      textAlign: 'center',
    }),
    hiddenWrapperCloserLook: {
      width: '100%',
      overflowX: 'hidden',
    },
  }),
  variants: {
    adaptiveTabbedPDP: () => ({
      mobileCloserlookHeading: () => ({
        fontSize: 'var(--text-26)',
        fontFamily: 'var(--font-face1-bold)',
        color: 'var(--color-primary)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textAlign: 'start',
        marginBottom: '5px',
      }),
    }),
  },
}
