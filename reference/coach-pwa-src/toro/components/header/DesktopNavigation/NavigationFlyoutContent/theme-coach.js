export default {
  parts: ['navigationFlyoutContentText', 'navigationFlyoutContentBox'],
  baseStyle: ({ theme }) => ({
    navigationFlyoutContentText: {
      color: theme.colors.main.white,
      textDecoration: 'underline',
    },
    navigationFlyoutContentBox: {
      backgroundColor: theme.colors.main.black,
      opacity: '0.3',
    },
    navigationFlyoutContentContainer: {
      justifyContent: 'center',
      w: '100%',
      flexDirection: 'column',
      position: 'relative',
    },
  }),
}
