export default {
  parts: [
    'signupFormWrapper',
    'signupFormEmailInput',
    'signupFormButton',
    'signupFormErrorText',
    'checkboxButton',
  ],
  baseStyle: ({ theme }) => ({
    signupFormWrapper: {
      mb: 'l',
    },
    signupFormEmailInput: (isDesktop) => ({
      bg: theme.colors.main.white,
      borderRadius: '2px 0 0 2px',
      border: '1px solid',
      borderColor: theme.colors.main.black,
      color: theme.colors.main.black,
      fontSize: theme.fontSizes.md,
      fontFamily: theme.fontFamily.primaryNormal,
      px: theme.space.m,
      py: theme.space.mar,
      maxW: isDesktop ? '309px' : 'auto',
      '&::placeholder': {
        color: theme.colors.neutral.inactive,
      },
    }),
    signupFormButton: {
      p: '16px 24px',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.main.white,
      fontWeight: 'bold',
      fontFamily: theme.fontFamily.primaryNormal,
      borderRadius: '0 2px 2px 0',
      minWidth: 'auto',
      height: theme.space.xxl,
    },
    signupFormErrorText: {
      color: theme.colors.error.primary,
      mt: 'xs',
    },
    checkboxButton: {
      alignItems: 'flex-start',
      borderColor: theme.colors.main.gray,
    },
    checkboxWrapper: {
      flexDirection: 'column',
    },
  }),
}
