export default {
  baseStyle: ({ theme }) => {
    return {
      privacyPolicyTextStyles: () => ({
        ...theme.typography['text-body2-m'],
        a: {
          ...theme.typography['text-body2-m'],
        },
        color: 'var(--color-primary)',
        'p.email-description.body-text-md-secondary, p.email-policy.body-text-md-secondary': {
          ...theme.typography['text-body2-m'],
        },
      }),
    }
  },
}
