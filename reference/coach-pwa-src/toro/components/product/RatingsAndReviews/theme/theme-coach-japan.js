export default {
  baseStyle: ({ theme }) => ({
    reviewHeader: ({ isModalContent, isDesktop }) => ({
      mt: isModalContent ? 0 : isDesktop ? '43px' : '32px',
      '&.reviews__heading': {
        marginBottom: 0,
        textAlign: 'center',
        ...theme.typography['text-display1-m'],
      },
    }),
    pdpReviewsDetailsTitle: {
      ...theme.typography['text-display1-s'],
      color: theme.colors.main.black,
    },
    pdpReviewsDetailsDesc: () => ({
      mt: '16px',
      ...theme.typography['text-body2-m'],
      color: 'var(--color-black-base)',
      overflow: 'hidden',
    }),
    pdpReviewsHelpfulLabel: {
      ...theme.typography['text-body1-m'],
      color: theme.colors.main.black,
      mr: '16px',
    },
    reviewCTA: {
      ...theme.typography['text-cta1-m'],
      border: '1px solid #d8d8d8 !important',
      color: theme.colors.main.primary,
      _focus: { border: '2px solid black' },
    },
    pdpRatingDetailsPoints: {
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.black,
      mr: '8px',
      ml: '8px',
    },
    pdpRatingDetailsCount: {
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.black,
      mr: '8px',
      ml: '8px',
    },
    starHeaderWrapper: {
      mb: 'var(--spacing-4)',
    },
    pdpReviewsRatingDetailsUserInfo: {
      ...theme.typography['text-body2-m'],
      color: theme.colors.main.black,
    },
    pdpReviewsRatingDetailsInfo: {
      ...theme.typography['text-body2-m'],
      color: theme.colors.main.black,
    },
    readMore: {
      mr: '5px',
      ...theme.typography['text-cta1-s'],
    },
    viewAllReviewCTA: {
      border: '1px solid #d8d8d8 !important',
      ...theme.typography['text-cta1-s'],
    },
    noResultReviewsMessage: {
      textAlign: 'center',
      ...theme.typography['text-body1-s'],
    },
  }),
  variants: {
    tabbedPDPReviewList: ({ theme }) => ({
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            fontSize: 'var(--text-55)',
          },
        },
      }),
      ratingWithPercentContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridTemplateColumns: '26px auto 34px',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            fontSize: 'var(--text-55)',
          },
        },
      }),
      ratingWithPercentContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridTemplateColumns: '26px auto 34px',
        },
      },
    }),
  },
}
