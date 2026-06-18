export default {
  parts: ['navigationFlyoutContentText', 'navigationFlyoutContentBox'],
  baseStyle: ({ theme }) => ({
    navigationFlyoutContentText: {
      ...theme.typography['text-body1-m'],
      color: theme.colors.main.white,
      textDecoration: 'underline',
    },
    navigationFlyoutContentBox: {
      backgroundColor: theme.colors.main.black,
      opacity: '0.3',
    },
  }),
}
