export default {
  parts: ['privacyPolicyTextStyles'],
  baseStyle: ({ theme }) => ({
    privacyPolicyTextStyles: () => ({
      p: {
        color: 'var(--color-neutral-dark)',
        '&.body-text-md-secondary': {
          ...theme.typography['text-body2-m'],
          a: {
            ...theme.typography['text-body2-m'],
            textDecoration: 'underline',
          },
        },
        '&.email-policy.body-text-md-secondary': {
          mt: theme.space.m,
        },
      },
    }),
  }),
}
