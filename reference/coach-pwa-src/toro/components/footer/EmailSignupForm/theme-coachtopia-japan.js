export default {
  baseStyle: ({ theme }) => ({
    signupFormEmailInput: () => ({
      border: `1px solid`,
      borderColor: 'var(--color-neutral-medium)',
      borderRadius: '2px 0px 0px 2px',
      '&::placeholder': {
        ...theme.typography['text-body2-l'],
      },
    }),
    signupFormButton: {
      ...theme.typography['text-cta1-m'],
    },
    signupFormWrapper: {
      fontFamily: 'var(--font-face1-medium)',
    },
  }),
}
