export default {
  variants: {
    pdpV5: () => ({
      reviewsInfo: {
        '.reviews-write-review': {
          right: 'auto',
          // Default: when reviews are present
          top: 'calc(50% + 40px)',
        },
        // When no reviews (adjacent sibling selector)
        '.reviews-info-details.no-reviews + .reviews-write-review': {
          top: 'var(--spacing-4)',
        },
      },
    }),
  },
}
