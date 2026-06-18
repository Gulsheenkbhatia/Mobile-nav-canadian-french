export default {
  baseStyle: {
    whishlistIcon: {
      '&:focus': {
        boxShadow: 'none',
      },
    },
    //add empty function to prevent error that caused crash application "whishlistButton in not a function"
    whishlistButton: () => ({}),
    mainWishlistWrapper: ({ isTangibleeVisible, isPDP }) => ({
      top: isTangibleeVisible ? 'var(--spacing-16)' : 'var(--spacing-4)',
      right: isPDP ? 'var(--spacing-3)' : 'var(--spacing-4)',
    }),
  },
}
