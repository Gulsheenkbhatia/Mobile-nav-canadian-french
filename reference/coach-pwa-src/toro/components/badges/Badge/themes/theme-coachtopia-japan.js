export default {
  baseStyle: () => ({
    customBadge: ({ isOnImagePdp, page }) => ({
      '&.custom-badge>div': {
        fontFamily: 'var(--font-face1-medium)',
        backgroundColor: page === 'pdp' ? 'var(--color-white-80)' : null,
        mx: 0,
        my: isOnImagePdp ? 'var(--spacing-3)' : 'var(--spacing-2)',
        px: isOnImagePdp ? 'var(--spacing-2)' : 0,
        mt: page === 'pdp' ? 'var(--spacing-1)' : null,
      },
      '&.custom-badge label': {
        backgroundColor: isOnImagePdp ? 'var(--color-white-80)' : 'unset',
        p: 0,
      },
    }),
  }),
  variants: {
    lowInventoryAboveATB: () => ({
      textAlign: 'center',
      color: 'var(--color-sale)',
    }),
  },
}
