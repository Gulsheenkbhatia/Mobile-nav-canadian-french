export default {
  parts: ['rotatingBannerContainer'],
  variants: {
    adaptiveTabbedPDP: () => ({
      rotatingBannerContainer: {
        '.product-info-message-alert': {
          background: 'transparent',
        },
      },
    }),
  },
}
