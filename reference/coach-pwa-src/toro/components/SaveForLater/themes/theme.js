export default {
  parts: ['whishlistButton', 'mainWishlistWrapper', 'redesignWishlistWrapper'],

  baseStyle: () => ({
    whishlistButton: (increaseSpacing) => ({
      p: increaseSpacing
        ? 'var(--spacing-4) var(--spacing-3) var(--spacing-3) var(--spacing-4)'
        : 'xs',
    }),
  }),
  variants: {
    inlinegrid: {
      whishlistButton: () => ({
        p: 0,
      }),
      mainWishlistWrapper: () => ({
        top: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 10,
      }),
    },
    pdpRedesign: {
      redesignWishlistWrapper: (isRecommTile) => ({
        mb: '10px',
        right: isRecommTile ? 'var(--spacing-4)' : '29px',
        top: isRecommTile ? 'var(--spacing-2)' : 'unset',
      }),
    },
  },
}
