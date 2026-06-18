export default {
  parts: ['rotatingBannerContainer'],
  variants: {
    adaptiveTabbedPDP: () => ({
      rotatingBannerContainer: {
        w: 'unset',
        margin: '0 var(--spacing-3) var(--spacing-3)',
        background: 'var(--color-secondary)',
        borderRadius: 'var(--spacing-1)',
      },
    }),
  },
}
