export default {
  baseStyle: ({ theme }) => ({
    root: {
      textTransform: 'uppercase',
      marginLeft: theme.space['8'],
      fontSize: theme.fontSizes.xs,
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.primary,
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
      '@media (max-width: 991px)': {
        marginLeft: 0,
        marginTop: theme.space['8'],
        letterSpacing: theme.letterSpacings.xl,
      },
    },
    badge: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 70,
      padding: '2px 6px 3px 12px',
      color: theme.colors.white,
      fontSize: theme.fontSizes.xxs,
      marginRight: '4px',
      position: 'relative',
      fontWeight: 'var(--chakra-fontWeights-medium)',
      '&:before': {
        content: '""',
        width: '4px',
        height: '4px',
        position: 'absolute',
        top: '50%',
        left: '6px',
        background: 'white',
        borderRadius: '50%',
        transform: 'translate(0, -50%)',
      },
    },
    liveEvent: {
      background: '#E8362C',
      fontFamily: theme.fontFamily.primaryBold,
    },
    recordedEvent: {
      background: theme.colors.success.primary,
    },
  }),
  variants: {
    mobileV2: () => ({
      eventsText: {
        color: 'var(--scheme-text-color)',
      },
    }),
  },
}
