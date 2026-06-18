export default {
  parts: ['LazyRatingsAndReviews'],
  baseStyle: () => ({
    pdpBadgeOnImage: ({ isDesktop }) => ({
      left: isDesktop ? '125px' : 'var(--spacing-3)',
    }),
  }),
}
