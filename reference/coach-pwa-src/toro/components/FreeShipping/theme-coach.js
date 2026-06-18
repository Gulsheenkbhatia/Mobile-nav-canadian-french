export default {
  parts: ['freeShippingContent'],
  baseStyle: ({ theme }) => ({
    freeShippingContent: {
      '& a:hover': { textDecoration: 'underline' },
      '& a, & div': { fontFamily: theme.fontFamily.secondaryNormal },
    },
  }),
}
