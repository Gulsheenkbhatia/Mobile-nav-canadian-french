export default {
  baseStyle: ({ theme }) => ({
    privacyPolicyTextStyles: (isDesktop) => ({
      a: {
        fontFamily: `var(--font-face2-normal)`,
        borderBottom: `1px solid var(--color-neutral-dark)`,
        paddingBottom: '2px',
        '&:hover': {
          textDecoration: 'none',
        },
      },
      p: {
        pb: 'm',
      },
      ...theme.typography['text-body2-m'],
      color: 'var(--color-standout-primary)',
      letterSpacing: 'normal',
      'p.email-description.body-text-md-secondary, p.email-policy.body-text-md-secondary': {
        fontSize: isDesktop ? 'xs' : 'sm',
      },
    }),
  }),
}
