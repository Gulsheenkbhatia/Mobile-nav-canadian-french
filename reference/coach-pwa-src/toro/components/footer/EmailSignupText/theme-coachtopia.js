export default {
  baseStyle: ({ theme }) => ({
    privacyPolicyTextStyles: (isDesktop) => ({
      a: {
        fontFamily: `${theme.fontFamily.secondaryNormal}`,
        borderBottom: `1px solid ${theme.colors.neutral.dark}`,
        paddingBottom: '2px',
        '&:hover': {
          textDecoration: 'none',
        },
      },
      p: {
        pb: 'm',
      },
      ...theme.typography['text-body2-s'],
      color: theme.colors.standout.primary,
      letterSpacing: 'normal',
      'p.email-description.body-text-md-secondary, p.email-policy.body-text-md-secondary': {
        fontSize: isDesktop ? theme.fontSizes.xs : theme.fontSizes.sm,
      },
    }),
  }),
}
