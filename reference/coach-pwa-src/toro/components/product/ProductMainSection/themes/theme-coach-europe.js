export default {
  parts: ['NotifyMeWrapper', 'AddToBagCTAWrapper'],
  baseStyle: () => ({}),
  variants: {
    adaptiveTabbedPDP: () => ({
      AddToBagCTAWrapper: {
        '.atb-ctas-wrapper, .atb-wrapper, .add-to-cart, .atb-notify-wrapper, .notify-me': {
          height: '42px',
        },
      },
      NotifyMeWrapper: {
        height: '42px',
        '.notify-me': {
          height: '42px',
        },
      },
      addToBagCTAButtons: {
        height: '42px',
        '.main-selector': {
          height: '42px',
        },
        '.atb-wrapper': {
          height: '42px',
        },
      },
    }),
  },
}
