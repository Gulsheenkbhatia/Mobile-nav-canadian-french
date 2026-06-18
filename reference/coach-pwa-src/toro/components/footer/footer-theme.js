export default {
  parts: [
    'footerSearchWrapper',
    'footerWrapper',
    'footerMainContainer',
    'footerInnerPadding',
    'signupFormFooterWrapper',
    'footerDivider',
  ],
  baseStyle: ({ theme }) => ({
    paymentLogos: {
      '.logowrapper ': {
        justifyContent: 'space-evenly',
      },
    },
    footerSearchWrapper: {
      p: { lg: `97px 125px ${theme.space.l}`, base: '0' },
      mx: 'auto',
      '&.footer_search': {
        marginBottom: '80px',
      },
    },
    footerWrapper: {
      backgroundColor: theme.colors.neutral.light,
    },
    footerMainContainer: {
      p: `${theme.space.l} ${theme.space.mar} ${theme.space.s}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    footerInnerPadding: (isDesktop) => ({
      p: isDesktop
        ? {
            base: `20px 0px ${theme.space.l} 0px`,
            lg: `20px 76px ${theme.space.l} 0px`,
          }
        : '0',
    }),
    signupFormFooterWrapper: {
      marginLeft: { base: '0.67%', lg: '55px' },
      marginRight: '0.67%',
    },
    footerDivider: {
      borderColor: theme.colors.neutral.inactive,
      opacity: '1',
    },
    subBrandFooter: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: '16px',
    },
  }),
}
