export default {
  parts: [
    'childrenStyle',
    'drawerContent',
    'searchIconButton',
    'searchWidgetContainer',
    'drawerCloseButton',
  ],
  baseStyle: () => ({
    searchIconButton: {
      top: '3px',
    },
    searchWidgetContainer: {
      pt: 'var(--spacing-4)',
    },
  }),
  variants: {
    mobileV2: {
      searchWidgetContainer: {
        p: 0,
        pt: 0,
        flexGrow: '1',
        mt: 0,
      },
      drawerContent: {
        maxWidth: '100%',
      },
    },
  },
}
