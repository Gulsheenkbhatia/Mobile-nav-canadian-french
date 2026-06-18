export default {
  parts: ['reviewTitleContainer'],
  baseStyle: () => ({
    incentivizedReview: {
      '& .incentivized-review-body-text': {
        textTransform: 'none',
      },
    },
  }),
  variants: {
    tabbedPDPReviewList: ({ theme }) => ({
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            display: 'flex',
            alignItems: 'flex-start',
          },
          '.no-reviews': {
            flexDirection: 'column',
          },
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            display: 'flex',
            alignItems: 'flex-start',
            marginTop: 'var(--spacing-6)',
          },
          '.no-reviews': {
            flexDirection: 'column',
          },
        },
      }),
      reviewContentContainer: {
        py: 'var(--spacing-1)',
      },
    }),
  },
}
