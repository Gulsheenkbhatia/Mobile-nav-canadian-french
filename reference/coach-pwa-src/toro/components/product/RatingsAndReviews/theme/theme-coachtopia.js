export default {
  baseStyle: ({ theme }) => ({
    starSizes: {
      width: '15.26',
      height: '14.2',
    },
    starSizesReviewItem: {
      width: '13.12',
      height: '12.21',
    },
    thumbsIconsSize: {
      width: '15',
      height: '14.4',
      viewBox: '0 0 16 15',
    },
    reviewHeader: ({ isModalContent, isDesktop }) => ({
      mt: isModalContent ? 0 : isDesktop ? '43px' : '32px',
      '&.reviews__heading': {
        marginBottom: 0,
        textAlign: 'center',
        ...theme.typography['text-display1-m'],
      },
    }),
    reviewContentMainContainer: ({ isDesktop }) => ({
      margin: isDesktop ? '0px 116px 40px' : '0px 12px 20px',
    }),
    pdpReviewsDetailsTitle: {
      ...theme.typography['text-display1-s'],
      color: theme.colors.main.black,
    },
    pdpReviewsDetailsDesc: () => ({
      mt: theme.space.m,
      ...theme.typography['text-body2-m'],
      color: 'var(--color-black-base)',
      overflow: 'hidden',
    }),
    pdpReviewsHelpfulLabel: {
      ...theme.typography['text-body2-m'],
      color: theme.colors.main.black,
      mr: theme.space.m,
    },
    reviewCTA: {
      ...theme.typography['text-cta1-m'],
      border: '1px solid var(--color-neutral-base) !important',
      color: theme.colors.main.primary,
      _focus: { border: '2px solid black' },
      width: { base: '100%', lg: '424px' },
      '@media (max-width: 769px)': {
        ...theme.typography['text-cta1-s'],
      },
      minHeight: { base: '40px', lg: '48px' },
    },
    pdpRatingDetailsPoints: {
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.black,
      mr: theme.space.s,
      ml: theme.space.s,
    },
    pdpRatingDetailsCount: {
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.black,
      mr: theme.space.s,
      ml: theme.space.s,
    },
    starHeaderWrapper: {
      mb: theme.space.m,
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
      border: '1px solid var(--color-neutral-base) !important',
      width: { base: '100%', lg: '424px' },
      ...theme.typography['text-cta1-m'],
      '@media (max-width: 769px)': {
        ...theme.typography['text-cta1-s'],
      },
      minHeight: { base: '40px', lg: '48px' },
    },
    noResultReviewsMessage: {
      textAlign: 'center',
      ...theme.typography['text-body1-s'],
    },
  }),
}
