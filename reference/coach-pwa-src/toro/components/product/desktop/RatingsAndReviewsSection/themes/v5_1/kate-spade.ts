const pdpRatingDetailsText = {
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12, 12px)',
  lineHeight: 'var(--line-height-100)',
  letterSpacing: 'var(--letter-spacing-s)',
}

export default {
  parts: [
    'reviewsSectionWrapper',
    'reviewsInfoDetails',
    'starAndReviewCount',
    'pdpRatingDetailsPoints',
    'pdpRatingDetailsCount',
    'reviewCTAContainer',
    'reviewListItemContainer',
    'ratingInformationBox',
    'pdpReviewsRatingDetailsUserInfo',
    'pdpReviewsDetailsTitle',
    'pdpReviewsBottomLine',
    'reviewSummaryContainer',
    'reviewSummaryCta',
    'reviewSummaryTitle',
    'reviewSummaryContent',
    'reviewSummaryHintContainer',
    'reviewSummaryHintIcon',
    'reviewSummaryHintText',
    'reviewHelpfulContainer',
    'pdpReviewsHelpfulLabel',
    'pdpReviewsHelpfulVotedown',
    'pdpReviewsHelpfulVoteCount',
    'viewAllReviewCTA',
    'ratingWithPercentMainContainer',
    'overallFitContainer',
    'ratingInformationHeader',
    'pdpReviewsRatingDetailsInfo',
    'incentivizedReview',
  ],
  baseStyle: ({ theme }) => ({
    pdpReviewsRatingDetailsInfo: {
      marginBottom: 'var(--spacing-1)',
      ...theme.typography['text-body1-s'],
      fontWeight: '500',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s)',
      color: '#000003',
      textTransform: 'none',
    },
    incentivizedReview: {
      mt: '-5px',
      mb: '5px',
      '& .incentivized-review-title': {
        ...theme.typography['text-title2-s'],
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontWeight: '500',
      },
      '& .incentivized-review-body-button': {
        ...theme.typography['text-title2-s'],
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
    pdpV5: ({ theme }) => ({
      reviewsSectionWrapper: {
        maxWidth: '1320px',
        marginX: 'auto',
        padding: 'var(--spacing-0)',
        '& .reviews__heading': {
          marginBottom: '5px',
          ...theme.typography['text-display1-xl'],
          lineHeight: 'var(--line-height-115)',
          letterSpacing: 'var(--letter-spacing-s)',
        },
      },
      reviewsInfo: {
        marginBottom: 'var(--spacing-0)',
      },
      reviewsInfoDetails: {
        gap: 'var(--spacing-0)',
      },
      starAndReviewCount: {
        marginTop: 'var(--spacing-4)',
      },
      pdpRatingDetailsPoints: {
        ...pdpRatingDetailsText,
      },
      pdpRatingDetailsCount: {
        ...pdpRatingDetailsText,
      },
      reviewCTAContainer: {
        top: 'calc(50% - 29px)',
        '& button': {
          ...pdpRatingDetailsText,
          paddingRight: '14px',
          borderColor: 'var(--color-neutral-light-2, #e1e1e1)',
        },
        '& button svg': {
          width: '10px',
          marginLeft: '5px',
        },
      },
      reviewListItemContainer: {
        padding: '47px var(--spacing-3) 42px',
      },
      ratingInformationBox: {
        width: '293px',
        marginTop: '-2px',
      },
      pdpReviewsRatingDetailsUserInfo: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-s)',
        textTransform: 'none',
      },
      pdpReviewsDetailsTitle: {
        marginBottom: 'var(--spacing-2)',
        ...theme.typography['text-body1-l'],
        lineHeight: 'var(--line-height-120)',
        fontWeight: '500',
        letterSpacing: 'var(--letter-spacing-m)',
        '& + .review-response-details-description': {
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-s)',
        },
      },
      pdpReviewsBottomLine: {
        marginTop: '22px',
        '& span': {
          ...theme.typography['text-body1-xs'],
          fontSize: 'var(--text-10, 10px)',
          lineHeight: 'var(--line-height-140)',
          fontWeight: '500',
          letterSpacing: 'var(--letter-spacing-s)',
        },
      },
      reviewHelpfulContainer: {
        marginTop: '25px',
        alignItems: 'baseline',
        gap: '28px',
      },
      reviewSummaryContainer: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '100%',
          marginTop: 'var(--spacing-8)',
          padding: 'var(--spacing-6)',
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
          ...theme.typography['text-body2-l'],
          borderRadius: 'var(--border-radius-m)',
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
          ...theme.typography['text-display1-ms'],
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
      reviewSummaryHintText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-xs'],
          fontWeight: '400',
        },
      },
      pdpReviewsHelpfulLabel: {
        ...theme.typography['text-body1-s'],
        fontWeight: '500',
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-s)',
        color: '#000003',
        textTransform: 'none',
        '& span': {
          top: '-1px',
        },
      },
      pdpReviewsHelpfulVotedown: {
        padding: '5px 10px',
      },
      pdpReviewsHelpfulVoteCount: {
        ...theme.typography['text-body1-xs'],
        fontWeight: '500',
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
      viewAllReviewCTA: {
        gap: '9px',
        ...pdpRatingDetailsText,
        padding: '10px var(--spacing-6)',
        borderColor: 'var(--color-neutral-light-2, #e1e1e1)',
        '& svg': {
          width: 'var(--spacing-3)',
          marginLeft: 'var(--spacing-0)',
        },
      },
      ratingWithPercentMainContainer: {
        maxWidth: '100%',
        paddingTop: '85px',
        paddingBottom: '72px',
        marginBottom: 'var(--spacing-0)',
        '& .review-rating-range-label': {
          marginBottom: 'var(--spacing-0)',
          ...theme.typography['text-body1-xl'],
          lineHeight: 'var(--line-height-135)',
          fontWeight: '400',
          color: 'var(--color-black-base, #000)',
          textTransform: 'none',
        },
        '& .review-rating-range-content div div': {
          ...theme.typography['text-body1-l'],
          lineHeight: 'var(--line-height-120)',
          fontWeight: '500',
          letterSpacing: 'var(--letter-spacing-m)',
          textTransform: 'none',
        },
        '& .review-rating-slider': {
          marginBottom: 'var(--spacing-3)',
          height: '6px',
          backgroundColor: 'var(--color-neutral-light-2, #e1e1e1)',
          borderRadius: '800px',
        },
        '& .review-rating-slider::-webkit-slider-thumb': {
          width: '71px',
          height: '6px',
          backgroundColor: 'var(--color-black-base, #000)',
          borderRadius: '800px',
        },
        '& .review-rating-range': {
          marginTop: 'var(--spacing-0)',
        },
        '& .review-rating-range + .review-rating-range': {
          marginTop: 'var(--spacing-8)',
          marginBottom: '-2px',
        },
        '&:empty': {
          paddingY: 'var(--spacing-0)',
          marginBottom: 'var(--spacing-8)',
        },
      },
      overallFitContainer: {
        marginBottom: 'var(--spacing-8)',
        ...theme.typography['text-body1-l'],
        lineHeight: 'var(--line-height-120)',
        textTransform: 'none',
        color: 'var(--color-black-base)',
      },
      ratingInformationHeader: {
        marginBottom: 'var(--spacing-1)',
      },
    }),
  },
}
