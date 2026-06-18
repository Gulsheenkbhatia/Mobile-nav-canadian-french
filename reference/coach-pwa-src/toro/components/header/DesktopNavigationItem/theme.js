const commonTextStyles = (theme, isActive) => ({
  textTransform: 'capitalize',
  borderBottom: `1px solid ${isActive ? theme.colors.main.black : 'transparent'}`,
})

export default {
  parts: ['wrapper', 'text', 'desktopNavigationItemBox'],
  baseStyle: ({ theme }) => ({
    desktopNavigationItemBox: (callOutcolor) => ({
      color: callOutcolor,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xl,
      letterSpacing: theme.letterSpacings.l,
      position: 'relative',
      top: '-3px',
      ml: '4px',
      _hover: { textDecoration: 'none' },
    }),
  }),
  variants: {
    tier1: () => ({
      wrapper: (theme) => {
        const { space } = theme
        return {
          margin: `0 ${space.l} ${space.xl} ${space.l}`,
          _first: { marginLeft: 0 },
          _last: { marginRight: 0 },
        }
      },
      text: (theme, isActive) => ({
        ...commonTextStyles(theme, isActive),
        textTransform: 'uppercase',
        '&:hover': { borderBottom: '1px solid var(--color-black-base)' },
      }),
    }),
    tier2: () => ({
      wrapper: (theme) => ({
        marginBottom: theme.space.m,
      }),
      text: (theme, isActive) => commonTextStyles(theme, isActive),
    }),
    tier3: () => ({
      wrapper: (theme) => ({
        marginBottom: theme.space.mar,
      }),
      text: (theme, isActive) => commonTextStyles(theme, isActive),
    }),
  },
  defaultProps: { variant: 'tier1' },
}
