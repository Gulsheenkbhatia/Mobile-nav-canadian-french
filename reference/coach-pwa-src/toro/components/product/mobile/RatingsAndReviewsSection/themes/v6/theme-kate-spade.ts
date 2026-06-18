export default {
  parts: ['incentivizedReview'],
  baseStyle: ({ theme }) => ({
    incentivizedReview: {
      mt: '-8px',
      mb: 'var(--spacing-4)',
      '& .incentivized-review-title': {
        ...theme.typography['text-title2-s'],
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontWeight: '500',
      },
      '& .incentivized-review-body-button': {
        ...theme.typography['text-title2-s'],
        color: 'var(--color-black-base)',
        fontWeight: '500',
      },
      '& .incentivized-review-body-text': {
        ...theme.typography['text-title2-s'],
        color: 'var(--color-white-base)',
        textAlign: 'center',
        fontWeight: '500',
        textTransform: 'none',
      },
      '& .incentivized-review-icon': {
        mt: '1px',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewsSectionRootWrapper: {
        pt: '60px',
        pb: 'var(--spacing-6)',
      },
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-neutral-light-1)',
        },
      }),
      viewAllReviewCTAContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-3) 0 0',
        },
      }),
      reviewHeader: () => ({
        '&.reviews__heading': {
          ...theme.typography['text-display2-m'],
          fontWeight: 400,
          fontSize: 'var(--text-36)',
          lineHeight: 'var(--line-height-100)',
          color: 'var(--color-primary)',
        },
      }),

      reviewsAverageRating: {
        ...theme.typography['text-display2-2xl'],
        lineHeight: 'var(--line-height-107)',
        height: 'auto',
      },

      pdpReviewsRatingUserProfile: {
        '& *': {
          ...theme.typography['text-badge1-xs'],
          lineHeight: 'var(--line-height-135)',
          fontWeight: 500,
          letterSpacing: '0.8px',
        },
      },
      pdpReviewsDetailsTitle: {
        ...theme.typography['text-display2-s'],
        fontWeight: '400 !important',
        lineHeight: 'var(--line-height-120) !important',
        letterSpacing: '0.2px !important',
      },
      pdpReviewsDetailsDesc: () => ({
        ...theme.typography['text-body1-s'],
        mt: '6px !important',
      }),
      readMoreWrapper: {
        '> span': {
          ...theme.typography['text-badge1-xs'],
          lineHeight: 'var(--line-height-135)',
          fontWeight: 500,
          letterSpacing: '0.8px',
        },
      },
      pdpReviewsRatingDetailsInfo: {
        ...theme.typography['text-cta1-pill-xs'],
        backgroundColor: 'var(--color-background-cta-pill-bg)',
      },
      pdpReviewsHelpfulLabel: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-135) !important',
      },
      pdpReviewsHelpfulVoteCount: {
        letterSpacing: '1px !important',
      },
    }),
  },
}
