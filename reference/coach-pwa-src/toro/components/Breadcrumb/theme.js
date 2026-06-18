export default {
  baseStyle: ({ theme }) => ({
    item: {
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
      fontSize: theme.fontSizes.xs,
    },
    container: {
      '& ol': { display: 'inline-flex' },
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      item: {
        lineHeight: theme.lineHeights.xl,
        letterSpacing: theme.letterSpacings.xs,
      },
    }),
    pdpv5: () => ({
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 'var(--spacing-8)',
        mx: 'var(--spacing-3)',
        '& ol': {
          display: 'inline-block',
          maxWidth: 'calc(100vw - var(--spacing-6))',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          textOverflow: 'ellipsis',
          ':hover': {
            overflowX: 'auto',
            textOverflow: 'clip',
          },
          '-ms-overflow-style': 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    }),
  },
}
