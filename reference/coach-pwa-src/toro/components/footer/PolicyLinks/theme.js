export default {
  parts: ['linkPolicyLinks', 'textPolicyLinks', 'policyLinksWrap'],
  baseStyle: ({ theme }) => ({
    linkPolicyLinks: {
      whiteSpace: 'normal',
      pr: 's',
      marginRight: {
        lg: '48px',
      },
      '&:hover': {
        textDecoration: 'none',
      },
    },
    textPolicyLinks: {
      textAlign: 'left',
      px: 0,
      textTransform: 'uppercase',
      letterSpacing: theme.letterSpacings.lg,
      mb: theme.space.l,
      fontSize: theme.fontSizes.xxs,
      color: theme.colors.black,
    },
    policyLinksWrap: {
      pt: theme.space.m,
    },
  }),
}
