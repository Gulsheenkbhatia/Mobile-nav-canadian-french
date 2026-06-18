export default {
  parts: ['rotatingBannerContainer'],
  variants: {
    adaptiveTabbedPDP: () => ({
      rotatingBannerContainer: {
        '.klarna-container': {
          flexWrap: 'nowrap',
        },
      },
    }),
  },
}
