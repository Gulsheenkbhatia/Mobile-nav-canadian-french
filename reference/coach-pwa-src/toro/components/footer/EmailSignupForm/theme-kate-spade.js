export default {
  baseStyle: ({ theme }) => {
    return {
      signupFormWrapper: {
        'input.input-error': {
          borderColor: 'var(--color-error-primary)',
          outline: 'none',
          '&:focus': {
            boxShadow: '0 var(--color-error-primary)',
          },
        },
      },
      signupFormEmailBorder: {
        border: 'var(--border-width-m) solid var(--color-primary)',
      },
      signupFormEmailInput: () => ({
        background: 'var(--color-secondary)',
        boxSizing: 'border-box',
        borderRadius: 'var(--border-radius-none)',
        maxW: 'auto',
        '&::placeholder': {
          ...theme.typography['text-body1-l'],
        },
      }),
      signupFormButton: {
        ...theme.typography['text-cta1-m'],
      },
      signupFormErrorText: {
        ...theme.typography['text-body1-s'],
      },
    }
  },
}
