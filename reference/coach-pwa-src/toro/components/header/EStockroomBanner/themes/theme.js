export default {
  parts: [
    'bannerEstockroomWrapper',
    'bannerEstockroomContainer',
    'bannerEstockroomContent',
    'bannerEstockroomLogoutButton',
    'bannerEstockroomIcon',
  ],

  baseStyle: ({ theme }) => ({
    bannerEstockroomWrapper: {
      paddingTop: '16px',
      paddingBottom: '16px',
    },
    bannerEstockroomContainer: {
      maxWidth: theme.maxLayoutWidth || '1344px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '0px auto',

      '@media(max-width: 769px)': {
        flexDirection: 'column',
      },
    },
    bannerEstockroomContent: {
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.fontFamily.primaryNormal,
      '@media(max-width: 769px)': {
        marginBottom: '8px',
      },
    },
    bannerEstockroomLogoutButton: {
      fontSize: '12px',
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    bannerEstockroomIcon: {
      width: '32px',
      height: '32px',
      marginRight: '4px',
    },
  }),
}
