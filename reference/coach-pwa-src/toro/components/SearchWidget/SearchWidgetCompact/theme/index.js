export default {
  parts: [
    'childrenStyle',
    'drawerContent',
    'searchIconButton',
    'searchWidgetContainer',
    'drawerCloseButton',
  ],
  baseStyle: ({ theme }) => ({
    childrenStyle: {
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
      mr: theme.space.s,
      '& > button': {
        margin: '0 auto',
      },
    },
    drawerContent: {
      maxWidth: `calc(100% - ${theme.space.xxl})`,
    },
    searchIconButton: {
      '&:focus': theme.focus,
      w: theme.space.l,
    },
    searchWidgetContainer: {
      p: `${theme.space.s} ${theme.space.m}`,
      flexGrow: '1',
    },
  }),
  variants: {
    mobileV2: ({ theme }) => ({
      drawerContent: {
        maxWidth: '100%',
        backgroundColor: 'var(--scheme-bg-color)',
      },
      drawerCloseButton: {
        position: 'fixed',
        top: '12px',
        right: '12px',
      },
      searchWidgetContainer: {
        p: `${theme.space.s} ${theme.space.m}`,
        flexGrow: '1',
        mt: '36px',
      },
    }),
  },
}
