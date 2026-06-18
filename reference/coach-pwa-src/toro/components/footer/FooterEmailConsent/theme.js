export default {
  parts: ['footerEmailTextStyles'],
  baseStyle: ({ theme }) => ({
    footerEmailTextStyles: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.md,
      a: {
        textDecoration: 'underline',
      },
      pl: theme.space.xs,
      '& .email-description': {
        padding: '0 !important',
      },
    },
  }),
}
