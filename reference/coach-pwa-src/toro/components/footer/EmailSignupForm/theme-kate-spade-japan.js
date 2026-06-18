export default {
  parts: ['signupFormButton'],
  baseStyle: ({ theme }) => ({
    signupFormButton: {
      ...theme.typography['text-cta1-m'],
    },
    signupFormEmailInput: () => ({
      maxW: 'auto',
      borderColor: 'var(--color-black-base))',
      borderRadius: '0',
      backgroundColor: 'var(--color-white-base)',
    }),
  }),
}
