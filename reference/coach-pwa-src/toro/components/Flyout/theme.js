export default {
  baseStyle: ({ theme }) => ({
    drawerContent: (type) => ({
      '& .chakra-modal__close-btn': {
        border: type === 'login' ? `1px solid ${theme.colors.main.gray}` : null,
      },
    }),
    passwordVisibilityButton: {
      position: 'absolute',
      right: theme.space.l,
      border: 'none',
      paddingTop: theme.space.m,
      textDecoration: 'underline',
      color: theme.colors.main.gray,
    },
  }),
}
