export default {
  baseStyle: ({ theme }) => {
    return {
      textPolicyLinks: {
        ...theme.typography['text-eyebrow1-m'],
      },
      policyLinksWrap: {
        pt: theme.space.l,
      },
    }
  },
}
