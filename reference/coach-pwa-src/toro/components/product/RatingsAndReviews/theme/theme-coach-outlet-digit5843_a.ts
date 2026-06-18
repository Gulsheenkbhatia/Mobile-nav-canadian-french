const pdpReviewsHelpfulVote = {
  backgroundColor: 'var(--color-white-base)',
  borderRadius: 'var(--border-radius-s)',
  border: 'var(--border-width-s) solid #C4C4C4',
  padding: 'var(--spacing-2)',
  margin: 0,
  '&.voted': {
    opacity: '0.2',
  },
}

const reviewCTAButton = {
  fontFamily: 'var(--font-face1-normal)',
  backgroundColor: 'var(--color-white-base)',
  borderRadius: 'var(--border-radius-s)',
  borderColor: '#C4C4C4 !important', // missing in the design token
  color: 'var(--color-black-base)',
  fontSize: 'var(--text-12)',
  lineHeight: 'var(--line-height-115)',
}

const icons = {
  width: '24px',
  height: '24px',
}

export default {
  baseStyle: ({ theme }) => ({
    reviewContentMainContainer: ({ isModalContent }) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: isModalContent ? '0px var(--spacing-3)' : 0,
      },
    }),
    reviewTitleContainer: (isModalContent) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '.reviews-info-details': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: isModalContent ? '21px 0px 0px' : 'var(--spacing-8) 0px 0px',
        },
        '.no-reviews': {
          flexDirection: 'column',
          alignItems: 'start',
        },
      },
    }),
    noResultReviewsMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-l'],
        margin: '14px 0 13px',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
      },
    },
    reviewHeaderContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'transparent',
        marginBottom: 0,
        padding: 0,
      },
    }),
    reviewHeader: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 0,
        '&.reviews__heading': {
          ...theme.typography['text-display4-s'],
          marginBottom: 0,
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-face1-extended-bold)',
          fontStyle: 'normal',
          textAlign: 'center',
          fontSize: 'var(--text-24)',
          letterSpacing: 'var(--letter-spacing-s)',
        },
      },
    }),
    displayRangeLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-neutral-base)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: 'var(--line-height-135)',
        marginBottom: '6px', // missing in the design token
      },
    },
    displayRangeContent: {
      marginBottom: 'var(--spacing-3)',
    },
    displayRangeContentBlock: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-s)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        '.review-rating-slider': {
          height: 'var(--spacing-1)',
          backgroundColor: 'var(--color-neutral-light)',
          '&::-webkit-slider-thumb': {
            height: 'var(--spacing-1)',
            backgroundColor: 'var(--color-black-base)',
          },
        },
      },
    },
    displayRangeContainerSize: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-140)',
      },
    },
    pdpRatingDetailsCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        fontWeight: 700,
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-xl)',
        lineHeight: 'var(--line-height-135)',
        mr: 0,
      },
    },
    reviewCTAContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '18px 0 var(--spacing-6)',
        pb: 0,
      },
    },
    reviewCTA: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-l'],
        ...reviewCTAButton,
      },
    },
    reviewListItemContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-white-base)',
        border: 'none',
        marginBottom: 'var(--spacing-3)',
        padding: 'var(--spacing-6) var(--spacing-3)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    ratingInformationBox: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        svg: {
          width: '12.571px',
          height: '12.571px',
        },
        marginBottom: '26px', // missing in the design token
      },
    },
    pdpReviewsRatingDetailsUserInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-m'],
        textTransform: 'uppercase',
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        letterSpacing: 'var(--letter-spacing-l)',
        lineHeight: 'var(--line-height-135)',
      },
    },
    pdpReviewsDetailsTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        letterSpacing: 'var(--letter-spacing-xs)',
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: 'var(--chakra-fontWeights-normal)',
        marginBottom: '10px',
      },
    },
    pdpReviewsDetailsDesc: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginTop: 'var(--spacing-2)',
      },
    }),
    pdpReviewsDetailsDescV3Closed: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginTop: 'var(--spacing-2)',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
      },
    },
    pdpReviewsDetailsDescV3Opened: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginTop: 'var(--spacing-2)',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 'auto',
      },
    },
    readMoreWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-2)',
      },
    },
    readMore: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontFamily: 'var(--font-face1-normal)',
        textTransform: 'uppercase',
        fontSize: 'var(--text-10)',
        letterSpacing: 'var(--letter-spacing-xl)',
        lineHeight: 'var(--line-height-115)',
      },
    },
    pdpReviewsRatingDetailsInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '5px 10px',
        backgroundColor: 'var(--color-neutral-light)',
        border: 'var(--border-width-s) solid #C4C4C4', // color missing in the design token
        borderRadius: 'var(--spacing-10)',
        width: 'max-content',
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-120)',
      },
    },
    reviewHelpfulContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-3)',
        marginTop: 'var(--spacing-4)',
        backgroundColor: 'var(--color-neutral-light)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    pdpReviewsHelpfulVoteup: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...pdpReviewsHelpfulVote,
        '&.upVoted': {
          background: '#427E2B', // missing in the design token
          borderColor: '#427E2B', // missing in the design token
          svg: {
            path: {
              fill: 'var(--color-white-base)',
            },
          },
          '& .review-rating-vote-count': {
            color: 'var(--color-white-base)',
          },
        },
      },
    },
    pdpReviewsHelpfulVotedown: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...pdpReviewsHelpfulVote,
        marginLeft: 'var(--spacing-3)',
      },
    },
    reviewRatingVoteThumbs: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        svg: { width: '10.449px', height: '10.449px' },
        width: '11px',
      },
    },
    pdpReviewsHelpfulLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
    pdpReviewsHelpfulVoteCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-cta1-xs'],
        fontSize: '10px',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-115)',
        fontFamily: 'var(--font-face1-normal)',
        letterSpacing: 'var(--letter-spacing-xl)',
        '&.side-text-animation': {
          animationName: 'text-slide',
          animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
          animationDuration: '500ms',
          animationFillMode: 'backwards',
        },
      },
    },
    viewAllReviewCTAContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-3) 0px var(--spacing-10)',
      },
    }),
    viewAllReviewCTA: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...reviewCTAButton,
      },
    },
    reviewCTAIconSize: {
      width: '12px',
      height: '12px',
    },
    reviewModalBody: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-neutral-light)',
      },
    },
    ratingWithPercentModalContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-white-base)',
        margin: 'var(--spacing-6) 0',
        padding: 'var(--spacing-4) var(--spacing-3)',
        gap: 'var(--spacing-3)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    ratingWithPercentContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '26px auto 32px',
        gridGap: 'var(--spacing-3)',
      },
    },
    fullStarContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        gap: 'var(--spacing-1)',
        marginRight: 0,
        svg: {
          width: 'var(--spacing-4)',
          height: 'var(--spacing-4)',
        },
      },
    },
    ratingStarCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginRight: 0,
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
    ratingStarProgressBarSuperContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginRight: 0,
      },
    },
    ratingStarProgressBarContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: 'var(--spacing-1)',
        background: '#d9d9d9',
      },
    },
    ratingStarProgressBar: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: 'var(--spacing-1)',
        background: 'var(--color-black-base)',
      },
    },
    ratingStarPercent: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textAlign: 'right',
      },
    },
    ratingsFilterFormSearchBar: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        border: 'none',
        backgroundColor: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-s)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
      },
    },
    searchBarIcon: {
      ...icons,
    },
    filterBarIcon: {
      ...icons,
    },
    sortByLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-l)',
        textTransform: 'uppercase',
      },
    },
    filterByLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-l)',
        textTransform: 'uppercase',
      },
    },
    filterDropdownText: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        border: 'none',
        borderRadius: 'var(--border-radius-s)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
      },
    },
    pdpReviewmodalPaging: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-16)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 700,
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginBottom: '20px !important',
      },
    },
    contentDivider: {
      '& > div': {
        margin: 'var(--spacing-6) 0',
      },
    },
    reviewInfoWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        marginLeft: 'auto',
        width: 'fit-content',
        marginBottom: 'var(--spacing-3)',
      },
    },
    reviewInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontWeight: 400,
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        '&:first-of-type': {
          paddingRight: 'var(--spacing-2)',
        },
      },
    },
    reviewRatingRange: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        marginBottom: 'var(--spacing-6)',
      },
    },
    modalContentDividerWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    modalContentDivider: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: '100%',
        height: '1px',
        backgroundColor: '#24222233', // not existed in design-tokens
      },
    },
    searchReviews: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-6)',
      },
    },
    rectangle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderLeft: '1px solid #D8D8D8',
        paddingRight: '6px',
        height: '9px',
        marginTop: 'var(--spacing-1)',
      },
    },
    imageReview: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '16px',
        marginBottom: '0px',
      },
    },
    pdpReviewsClickableTag: (isSelected) => ({
      padding: '5px 10px',
      backgroundColor: isSelected ? 'black' : 'white',
      border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
      borderRadius: 'var(--spacing-10)',
      width: 'max-content',
      '& path': {
        fill: theme.colors.main.white,
      },
    }),
    pdpReviewsClickableTagText: (isSelected) => ({
      fontSize: 'var(--text-12)',
      fontWeight: '400',
      color: isSelected ? 'white' : 'black',
      ...theme.typography['text-body1-s'],
    }),
    starAndReviewCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 0,
      },
    },
  }),
  variants: {
    tabbedPDPReviewList: ({ theme }) => ({
      reviewHeaderContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginRight: '20px',
        },
      }),
      reviewTitleWrapper: {
        maxWidth: 'max-content',
        paddingTop: '15px',
        marginBottom: '-5px',
      },
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-3) 0 13px',
          lineHeight: 'var(--line-height-135)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewHeaderContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginRight: '20px',
        },
      }),
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-3) 0 13px',
          lineHeight: 'var(--line-height-135)',
        },
      },
    }),
  },
}
