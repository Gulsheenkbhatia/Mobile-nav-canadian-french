export default {
  parts: ['privacyPolicyTextStyles'],
  baseStyle: ({ theme }) => ({
    privacyPolicyTextStyles: (isDesktop) => ({
      '&#mw-email-signup-text': {
        '& p': {
          color: 'var(--color-primary)',
          '&.email-description.body-text-md-secondary': {
            ...(isDesktop ? theme.typography['text-body1-m'] : theme.typography['text-body1-s']),
          },
          '&.email-policy.body-text-md-secondary': {
            ...(isDesktop ? theme.typography['text-body1-m'] : theme.typography['text-body1-s']),
            mt: 'var(--spacing-4)',
          },
          a: {
            textDecoration: 'underline',
          },
        },
      },
    }),
  }),
}
