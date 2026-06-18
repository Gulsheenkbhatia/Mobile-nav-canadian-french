export default {
  parts: ['incentivizedReview', 'pdpReviewsRatingDetailsUserInfo', 'pdpReviewsRatingAgeRange'],
  baseStyle: ({ theme }) => ({
    reviewsSectionRootWrapper: {
      pt: '0',
      pb: 'var(--spacing-6)',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    reviewModalContent: {
      height: '100vh',
      minWidth: '100%',
    },
    reviewModalBody: {
      minHeight: '100vh',
      '&::-webkit-scrollbar': {
        width: '14px',
      },
      '&::-webkit-scrollbar-thumb': {
        height: '220px',
      },
    },
    reviewModalHeader: {
      position: 'sticky',
      top: '0',
    },
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
    reviewSummaryContainer: {
      marginBottom: 'var(--spacing-6)',
    },
    pdpReviewsRatingDetailsUserInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-m'],
        fontWeight: 400,
        textTransform: 'none',
      },
    },
    pdpReviewsRatingAgeRange: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-m'],
        fontWeight: 400,
        textTransform: 'none',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDPV7: ({ theme }) => ({
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-neutral-light-1)',
          padding: 'var(--spacing-8) var(--spacing-3)',
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
      reviewHeaderContainer: () => ({
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }),

      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            justifyContent: 'center',
            display: 'flex',
            gap: 'var(--spacing-6)',
          },
          '.no-reviews': {
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'unset',
            marginTop: '19px',
          },
        },
      }),
      reviewsInfoDetails: {
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 'var(--spacing-6)',
        '&.no-reviews': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'var(--spacing-6)',
        },
      },
      reviewsInfo: {
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--color-black-base)',
        gap: 'var(--spacing-6)',
      },

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
          letterSpacing: 'var(--letter-spacing-l)',
        },
      },

      pdpReviewsDetailsDesc: () => ({
        ...theme.typography['text-body1-s'],
        mt: '6px !important',
        overflow: 'hidden',
      }),
      readMoreWrapper: {
        mb: '0 !important',
        mt: 'var(--spacing-4) !important',
        '> span': {
          ...theme.typography['text-badge1-xs'],
          lineHeight: 'var(--line-height-135)',
          fontWeight: 500,
          letterSpacing: 'var(--letter-spacing-l)',
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

      reviewsSectionWrapper: {
        '& svg:has(use[href="#icon-star"])': {
          filter: 'brightness(0) saturate(100%)',
        },
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

      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          my: '0',
        },
      },

      reviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-black-base)',
          borderRadius: 'var(--border-radius-full)',
          color: 'var(--color-white-base)',
          svg: {
            marginLeft: 'var(--spacing-2)',
          },
        },
      },

      ratingWithPercentModalContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-4)',
        },
      },

      viewAllReviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-black-base)',
          borderRadius: 'var(--border-radius-full)',
          color: 'var(--color-white-base)',
        },
        '&:hover': {
          backgroundColor: 'var(--color-white-base)',
          color: 'inherit',
        },
        '&:active': {
          backgroundColor: 'var(--color-white-base)',
          color: 'inherit',
        },
      },

      reviewListItemContainer: {
        '&:last-child': {
          mb: 0,
        },
      },
    }),
  },
}
