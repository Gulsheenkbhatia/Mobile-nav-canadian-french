export default {
  parts: ['signupFormButton'],
  baseStyle: ({ theme }) => ({
    signupFormButton: {
      ...theme.typography['text-cta1-m'],
    },
    signupFormEmailInput: (isDesktop) => ({
      borderRadius: '2px 0 0 2px',
      borderColor: theme.colors.main.black,
      ...(isDesktop ? theme.typography['text-body1-l'] : theme.typography['text-body1-m']),
      bg: 'var(--color-white-base)',
    }),
  }),
}
