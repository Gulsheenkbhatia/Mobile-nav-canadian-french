export default {
  parts: [
    'reviewsSectionRootWrapper',
    'reviewsSectionWrapper',
    'reviewsInfo',
    'reviewsInfoDetails',
    'reviewHeaderContainer',
    'reviewHeader',
    'reviewsAverageRating',
    'wordCloudTagsText',
    'clickableTagsContainer',
    'reviewsCount',
    'pdpReviewsDetailsWrapper',
    'readMoreWrapper',
    'pdpReviewsHelpfulVoteCount',
    'reviewCTAContainer',
    'pdpReviewsDetailsTitle',
    'pdpReviewsDetailsDesc',
    'pdpReviewsRatingDetailsInfo',
    'ratingWithPercentModalContainer',
    'reviewListItemResponseContainer',
    'reviewHelpfulContainer',
    'pdpReviewsHelpfulLabel',
    'pdpReviewsRatingUserProfile',
    'viewAllReviewCTA',
    'incentivizedReview',
    'reviewContentMainContainer',
    'reviewContentContainer',
    'reviewListItemContainer',
    'viewAllReviewCTAContainer',
  ],
  baseStyle: ({ theme }) => ({
    incentivizedReview: {
      mt: '-5px',
      '& .incentivized-review-title': {
        ...theme.typography['text-title1-xs'],
        color: 'var(--color-neutral-dark)',
        textAlign: 'center',
        fontWeight: '400',
      },
      '& .incentivized-review-body-button': {
        ...theme.typography['text-title1-s'],
        fontWeight: '400',
      },
      '& .incentivized-review-body-text': {
        ...theme.typography['text-cta2-xs'],
        color: 'var(--color-white-base)',
        textAlign: 'center',
        fontWeight: '400',
      },
      '& .incentivized-review-icon': {
        mt: '-3px', // need to apply proper position of svg
      },
    },
  }),
  variants: {
    adaptiveTabbedPDPV7: ({ theme }) => ({
      reviewsSectionRootWrapper: {
        pt: 'var(--spacing-10)',
        pb: 'var(--spacing-8)',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      reviewsSectionWrapper: {
        '& svg:has(use[href="#icon-star"])': {
          filter: 'brightness(0) saturate(100%)',
        },
      },
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-3)',
        },
      }),
      viewAllReviewCTAContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-3) 0 0',
        },
      }),
      reviewContentContainer: {
        py: 0,
      },
      reviewListItemContainer: {
        '&:last-child': {
          mb: 0,
        },
      },
      reviewsInfo: {
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--color-black-base)',
        gap: 'var(--spacing-6)',
      },

      reviewsInfoDetails: {
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 'var(--spacing-6)',
        '&.no-reviews': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'var(--spacing-6)',
        },
        '&&': {
          mt: 0,
        },
      },

      reviewHeaderContainer: () => ({
        width: '100%',
      }),

      reviewHeader: () => ({
        '&.reviews__heading': {
          ...theme.typography['text-display1-m'],
          fontWeight: 700,
          fontSize: 'var(--text-26)',
        },
      }),

      reviewsAverageRating: {
        ...theme.typography['text-display1-2xl'],
        height: '60px',
      },

      wordCloudTagsText: {
        ...theme.typography['text-body1-s'],
      },
      clickableTagsContainer: {
        mt: 'var(--spacing-3) !important',
      },

      reviewsCount: {
        ...theme.typography['text-body1-s'],
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
      },
      reviewListItemResponseContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',

        '& > div:empty': {
          display: 'contents',
        },
      },
      reviewHelpfulContainer: {
        mt: '0 !important',
      },
      pdpReviewsDetailsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: '0',
        },
      },
      readMoreWrapper: {
        mb: '0 !important',
        mt: 'var(--spacing-4) !important',
        '& > span': {
          ...theme.typography['text-badge1-xs'],
          lineHeight: 'var(--line-height-115)',
        },
      },

      pdpReviewsHelpfulVoteCount: {
        fontWeight: 500,
        color: 'var(--color-black-base)',
      },
      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          my: '0',
        },
      },

      pdpReviewsDetailsTitle: {
        fontWeight: '700 !important',
        marginTop: 'var(--spacing-4) !important',
        mb: '10px',
      },

      pdpReviewsRatingDetailsInfo: {
        backgroundColor: '#F8F8F8',
      },
      ratingWithPercentModalContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-4)',
        },
      },
      viewAllReviewCTA: {
        '&:hover': {
          backgroundColor: 'var(--color-white-base)',
          color: 'inherit',
        },
        '&:active': {
          backgroundColor: 'var(--color-white-base)',
          color: 'inherit',
        },
      },
    }),
  },
}
