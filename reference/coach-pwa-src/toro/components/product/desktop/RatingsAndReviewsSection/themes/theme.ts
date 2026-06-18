const ctaStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  height: '48px',
  padding: '10px 14px 10px 18px',
  background: 'var(--color-white-base)',
  color: 'var(--color-black-base)',
  borderRadius: '130px',
  outline: 'none',
  borderColor: null,
  width: 'auto',
  minHeight: '48px',
  textTransform: 'none',
  border: '1px solid var(--color-neutral-light-2)',
  '& span': {
    position: 'relative',
    top: '1px',
    textTransform: 'lowercase',
    '&:first-letter': {
      textTransform: 'uppercase',
    },
  },
  '& svg': {
    m: '3px',
    color: 'var(--color-black-base)',
    '& > path': {
      stroke: 'var(--color-black-base)',
    },
  },
  '&:hover, &:active': {
    background: 'var(--color-black-base)',
    color: 'var(--color-white-base)',
    '& svg': {
      color: 'var(--color-white-base)',
      '& > path': {
        stroke: 'var(--color-white-base)',
      },
    },
  },
  '&:focus': {
    border: '1px solid var(--color-neutral-light-2)',
  },
}

const voteCtaStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-white-base)',
  border: '1px solid var(--color-neutral-light-2)',
  borderRadius: '800px',
  padding: '6px 10px',
  gap: '3px',
}

export default {
  parts: [
    'reviewsSectionWrapper',
    'reviewContentMainContainer',
    'reviewContentContainer',
    'reviewTitleContainer',
    'reviewsInfo',
    'reviewHeaderContainer',
    'reviewHeader',
    'reviewsInfoDetails',
    'starAndReviewCount',
    'pdpRatingDetailsPoints',
    'pdpRatingDetailsCount',
    'reviewCTAContainer',
    'reviewCTA',
    'viewAllReviewCTA',
    'viewAllReviewCTAContainer',
    'reviewListItemContainer',
    'ratingInformationBox',
    'ratingInformationHeader',
    'reviewSummaryContainer',
    'reviewSummaryTitle',
    'reviewSummaryContent',
    'reviewSummaryHintContainer',
    'reviewSummaryHintIcon',
    'reviewSummaryHintText',
    'reviewSummaryCta',
    'pdpReviewsRatingDetailsUserInfo',
    'pdpReviewsDetailsWrapper',
    'pdpReviewsDetailsTitle',
    'pdpReviewsDetailsDesc',
    'pdpReviewsBottomLine',
    'reviewHelpfulContainer',
    'reviewHelpfulContainer',
    'pdpReviewsHelpfulLabel',
    'pdpReviewsHelpfulVoteup',
    'pdpReviewsHelpfulVotedown',
    'thumbsIconsSize',
    'pdpReviewsHelpfulVoteCount',
    'reviewRatingVoteThumbs',
    'noResultReviewsMessage',
    'readMoreWrapper',
    'readMore',
    'ratingWithPercentMainContainer',
    'overallFitContainer',
  ],
  variants: {
    pdpV5: ({ theme }) => ({
      reviewsSectionWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0px 300px',
        maxWidth: '100vw',
        mb: '112px',
      },
      ratingWithPercentMainContainer: {
        width: '100%',
        marginBottom: 'var(--spacing-8)',
        '& .review-rating-range-label': {
          ...theme.typography['text-cta2-xs'],
          fontSize: 'var(--text-14)',
        },
        '& .review-rating-range-content div div': {
          ...theme.typography['text-cta2-xs'],
        },
      },
      overallFitContainer: {
        ...theme.typography['text-cta2-xs'],
        fontSize: 'var(--text-14)',
      },
      reviewContentMainContainer: () => ({
        width: '100%',
        maxWidth: theme.breakpoints.xlx,
        mt: 0,
      }),
      reviewContentContainer: {
        mx: 0,
      },
      reviewTitleContainer: () => ({
        display: 'flex',
        flexDirection: 'column',
      }),
      reviewHeaderContainer: () => ({
        background: 'none',
        mb: 0,
      }),
      reviewHeader: () => ({
        ...theme.typography['text-display4-xl'],
        color: 'var(--color-black-base)',
        position: 'relative',
        bottom: '7px',
      }),
      reviewsInfo: {
        position: 'relative',
        mb: 'var(--spacing-8)',
      },
      reviewsInfoDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
        '&.no-reviews': {
          gap: '62px',
          '& +.reviews-write-review': {
            top: 0,
          },
        },
      },
      noResultReviewsMessage: {
        ...theme.typography['text-body1-m'],
        borderTop: '1px solid var(--color-neutral-light-2)',
        borderBottom: '1px solid var(--color-neutral-light-2)',
        p: '62px 0',
      },
      starAndReviewCount: {
        justifyContent: 'start',
        alignItems: 'center',
        height: '16px',
      },
      pdpRatingDetailsPoints: {
        ...theme.typography['text-cta2-xs'],
        display: 'flex',
        alignItems: 'center',
        height: '16px',
        borderRight: '1px solid rgba(0, 0, 0, 0.15)',
        paddingRight: 'var(--spacing-2)',
        m: 0,
        textTransform: 'none',
      },
      pdpRatingDetailsCount: {
        ...theme.typography['text-cta2-xs'],
        display: 'flex',
        alignItems: 'center',
        height: '16px',
        paddingLeft: 'var(--spacing-2)',
        m: 0,
        textTransform: 'none',
      },
      reviewCTAContainer: {
        width: 'fit-content',
        m: 0,
        p: 0,
        position: 'absolute',
        right: 0,
        top: 'calc(50% - 24px)',
      },
      reviewCTA: {
        ...theme.typography['text-cta2-xs'],
        ...ctaStyles,
      },
      viewAllReviewCTA: {
        ...theme.typography['text-cta2-xs'],
        ...ctaStyles,
        padding: '10px 28px 10px var(--spacing-6)',
        color: '#000003',
        gap: '6px',
      },
      viewAllReviewCTAContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        mt: '49px',
      }),
      reviewListItemContainer: {
        flexDirection: 'row',
        padding: '44px var(--spacing-3)',
        gap: 'var(--spacing-8)',
        borderTop: '1px solid var(--color-neutral-light-2)',
        borderBottom: 'none',
        ':last-child': {
          borderBottom: '1px solid var(--color-neutral-light-2)',
        },
      },
      ratingInformationBox: {
        m: 0,
      },
      ratingInformationHeader: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        '& svg': {
          width: '13px',
          height: '13px',
        },
      },
      reviewSummaryContainer: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '100%',
          padding: 'var(--spacing-6)',
          marginTop: '0px',
          marginBottom: '10px',
          marginLeft: '0px',
          marginRight: '0px',
          textAlign: 'left',
          alignItems: 'start',
          background: 'var(--color-white-base)',
        },
      },
      reviewSummaryCta: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta2-xs'],
          borderRadius: 'var(--border-radius-full)',
          padding: '18px 38px 18px 36px',
          marginTop: '18px',
          marginBottom: '0px',
          textTransform: 'none',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-black-base)',

          svg: {
            height: '19px',
            width: '19px',
            filter: 'invert(1)',
          },
          span: {
            paddingTop: '3px',
          },
        },
      },
      reviewSummaryTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xs'],
          marginBottom: '18px',
        },
      },
      reviewSummaryContent: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-m'],
          marginBottom: 'var(--spacing-1)',
        },
      },
      reviewSummaryHintContainer: {
        flexDirection: 'row',
        gap: '9px',
        alignItems: 'end',
      },
      reviewSummaryHintIcon: {
        svg: {
          width: '16px',
          height: '15.616px',
        },
      },
      reviewSummaryHintText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-xs'],
        },
      },
      pdpReviewsRatingDetailsUserInfo: {
        ...theme.typography['text-cta2-xs'],
        color: '#000003',
      },
      pdpReviewsDetailsWrapper: {
        mb: 0,
      },
      pdpReviewsDetailsTitle: {
        ...theme.typography['text-display4-xxs'],
        mb: '10px',
        position: 'relative',
        bottom: '3px',
      },
      pdpReviewsDetailsDesc: () => ({
        ...theme.typography['text-body1-m'],
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineClamp: 2,
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
        color: '#000003',
        '&.show-all': {
          display: 'box',
          height: 'auto',
        },
        '&.show-less': {
          display: '-webkit-box',
          maxHeight: '48px',
        },
      }),
      readMoreWrapper: {
        ...theme.typography['text-link3-s'],
        mt: 'var(--spacing-3)',
        width: 'fit-content',
      },
      readMore: {
        mr: 0,
      },
      pdpReviewsBottomLine: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '32px',
        padding: 'var(--spacing-2) 14px',
        background: 'var(--color-white-base)',
        border: '1px solid var(--color-neutral-light-2)',
        borderRadius: '800px',
        width: 'auto',
        maxWidth: 'max-content',
        mt: 'var(--spacing-6)',
        '& span': {
          ...theme.typography['text-link2-xs'],
          textTransform: 'none',
          textDecoration: 'none',
          color: '#000003',
          position: 'relative',
          top: '2px',
        },
      },
      reviewHelpfulContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-8)',
        mt: 'var(--spacing-6)',
      },
      pdpReviewsHelpfulLabel: {
        ...theme.typography['text-cta2-xs'],
        mr: 0,
        '& span': {
          position: 'relative',
          top: '3px',
        },
      },
      pdpReviewsHelpfulVoteup: {
        ...voteCtaStyles,
        mr: 'var(--spacing-1)',
      },
      pdpReviewsHelpfulVotedown: {
        ...voteCtaStyles,
      },
      reviewRatingVoteThumbs: {
        mr: 0,
      },
      thumbsIconsSize: {
        width: '12px',
        height: '12px',
      },
      pdpReviewsHelpfulVoteCount: {
        ...theme.typography['text-cta2-xxs'],
        position: 'relative',
        top: '2px',
      },
    }),
  },
}
