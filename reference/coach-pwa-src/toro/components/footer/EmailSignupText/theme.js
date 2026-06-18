export default {
  parts: ['privacyPolicyTextStyles'],
  baseStyle: ({ theme }) => ({
    privacyPolicyTextStyles: () => ({
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
      color: 'var(--color-standout-primary)',
      letterSpacing: 'normal',
    }),
  }),
}
