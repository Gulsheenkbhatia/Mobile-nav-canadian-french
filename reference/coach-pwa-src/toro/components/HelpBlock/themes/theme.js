export default {
  parts: ['helpBlockContainer', 'helpBlockContent'],
  baseStyle: ({ theme }) => ({
    helpBlockContainer: (bgColor) => ({
      bg: bgColor,
    }),
    helpBlockContent: {
      '&': { textAlign: 'center' },
      '& .nosearch-help-block': {
        position: 'static',
        left: 'auto',
        marginTop: '0',
        backgroundColor: '#2e2e2e',
        marginLeft: '0',
        marginRight: '0',
      },
      '& .helpblock_icon': {
        display: 'flex',
        justifyContent: 'center',
      },
      '& .helpblock_message1': {
        fontSize: theme.fontSizes.xxl,
        lineHeight: theme.lineHeights.xs,
        color: theme.colors.main.white,
        fontWeight: '600',
        fontFamily: theme.fontFamily.primaryNormal,
      },
      '& .helpblock_message2': {
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.xl,
        color: theme.colors.main.white,
      },
      '& .helpblock_contactus': {
        display: 'flex',
        justifyContent: 'center',
      },
      '& .helpblock_contactus a': {
        alignItems: 'center',
        padding: `${theme.space.mar} ${theme.space.m}`,
        borderRadius: theme.borderRadius.default,
        border: `solid 1px ${theme.colors.main.inactive}`,
        fontFamily: theme.fontFamily.primaryNormal,
        fontSize: theme.fontSizes.xs,
        color: theme.colors.main.white,
      },
      '& #search-help': {
        backgroundColor: 'red',
      },

      '@media (max-width: 544px)': {
        '& .helpblock_message1': {
          maxWidth: '80%',
          fontSize: theme.fontSizes.lg,
          lineHeight: theme.lineHeights.s,
          letterSpacing: theme.letterSpacings.sm,
          marginBottom: theme.space.m,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        '& .helpblock_message2': {
          maxWidth: '76%',
          fontSize: theme.fontSizes.sm,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      '@media (min-width: 768px)': {
        '& .helpblock_icon .icon': {
          height: theme.space.xxl,
          width: theme.space.xxl,
        },
      },
    },
  }),
}
