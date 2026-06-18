export default {
  baseStyle: () => ({
    menuMobileContentarea: {
      bg: 'var(--color-cream)',
    },
    expendedNavbarContainer: {
      pt: 'var(--spacing-4)',
    },
    drawerWrapper: {
      '&:has(.search-widget-animation.open)': {
        background: 'transparent',
      },
    },
  }),
  variants: {
    mobileMenuV2: {
      expendedNavbarContainer: {
        p: 0,
        pt: 0,
      },
    },
  },
}
