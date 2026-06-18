export default {
  baseStyle: ({ theme }) => ({
    signupFormEmailInput: () => ({
      border: `1px solid`,
      borderColor: theme.colors.neutral.medium,
      borderRadius: '2px 0px 0px 2px',
      '&::placeholder': {
        ...theme.typography['text-body2-m'],
      },
    }),
    signupFormButton: {
      ...theme.typography['text-cta1-m'],
      fontWeight: 'unset',
    },
  }),
}
