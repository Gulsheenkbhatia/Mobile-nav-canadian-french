export default {
  parts: ['noProductTitle', 'clearFilterMessage', 'clearFilterButton'],
  baseStyle: ({ theme }) => ({
    noProductTitle: {
      fontSize: theme.fontSizes.double,
      mt: theme.space.m,
      textAlign: 'center',
    },
    clearFilterMessage: {
      fontSize: theme.fontSizes.md,
      fontFamily: theme.fontFamily.secondaryNormal,
      textAlign: 'center',
    },
    clearFilterButton: {
      mb: theme.space.xxl,
    },
  }),
}
