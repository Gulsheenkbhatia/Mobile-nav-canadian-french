export default {
  parts: ['t1MenuContainer', 't2MenuContainer', 't3MenuContainer', 'imageContainer', 'popup'],
  baseStyle: ({ theme, isTransparentHeader }) => ({
    t1MenuContainer: {
      boxShadow: isTransparentHeader ? 'none' : theme.boxShadow.header,
    },
    t2MenuContainer: {
      padding: theme.space.xxl,
    },
    t3MenuContainer: (isActive) => ({
      padding: theme.space.xxl,
      backgroundColor: isActive ? theme.colors.neutral.light : 'transparent',
    }),
    imageContainer: {
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    popup: (headerHeight = 0) => ({
      boxShadow: theme.boxShadow.header,
      backgroundColor: 'var(--color-white-base)',
      maxHeight: `calc(100vh - ${headerHeight}px)`,
      overflowY: 'auto',
      w: '100%',
      position: 'absolute',
      zIndex: '1',
    }),
    desktopMenuImageContainer: {
      height: '480px',
      maxWidth: '600px',
    },
    subMenuContainer: {
      width: 'calc(100% - (var(--spacing-3) * 2))',
      margin: '0 var(--spacing-3)',
      zIndex: '1',
    },
  }),
  defaultProps: {},
}
