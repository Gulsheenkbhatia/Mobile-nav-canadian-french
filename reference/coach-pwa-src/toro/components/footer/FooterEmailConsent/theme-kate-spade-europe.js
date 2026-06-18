export default {
  parts: ['footerEmailTextStyles'],
  baseStyle: ({ theme }) => ({
    footerEmailTextStyles: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.md,
      a: {
        textDecoration: 'none',
      },
      pl: theme.space.xs,
      '& .email-description': {
        padding: '0 !important',
      },
    },
  }),
}
