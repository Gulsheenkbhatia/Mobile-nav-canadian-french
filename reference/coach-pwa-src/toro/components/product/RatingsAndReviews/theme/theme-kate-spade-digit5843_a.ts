const pdpReviewsHelpfulVote = {
  backgroundColor: 'var(--color-white-base)',
  borderRadius: 'var(--border-radius-s)',
  border: 'var(--border-width-s) solid var(--border-color-inactive)',
  padding: 'var(--spacing-2)',
  margin: 0,
  '&.voted': {
    opacity: '0.2',
    transition: 'opacity var(--transition-duration-gentle); ease',
  },
}

const reviewCTAButton = {
  fontFamily: 'var(--font-face1-normal)',
  backgroundColor: 'var(--color-white-base)',
  borderRadius: 'var(--border-radius-s)',
  borderColor: 'var(--border-color-inactive) !important',
  color: 'var(--color-black-base)',
  fontSize: 'var(--text-12)',
  lineHeight: 'var(--line-height-135)',
  letterSpacing: 'var(--letter-spacing-l)',
  fontWeight: 500,
  padding: 'var(--spacing-4) var(--spacing-6)',
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
          margin: isModalContent ? 'var(--spacing-4) 0px 0px' : '36px 0px 15px', // missing in the design token
          '&:has(+ .reviews-write-review):not(.no-reviews)': {
            margin: isModalContent ? 'var(--spacing-4) 0px 0px' : '34px 0px -2px', // missing in the design token
            '& .reviews__heading': {
              fontSize: isModalContent ? 'var(--text-28)' : 'var(--text-24)',
              ...(!isModalContent
                ? {
                    lineHeight: 'var(--line-height-s)',
                    fontWeight: 400,
                  }
                : {}),
            },
          },
        },
        '.no-reviews': {
          flexDirection: 'column',
          alignItems: 'start',
        },
      },
    }),
    noResultReviewsMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '14px 0', // missing in the design token
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
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
          marginBottom: 0,
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face2-normal)',
          fontWeight: 400,
          fontStyle: 'normal',
          textAlign: 'center',
          fontSize: 'var(--text-24)',
          lineHeight: 'var(--line-height-s)',
        },
      },
    }),
    displayRangeLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-10)',
        fontWeight: 500,
        letterSpacing: 'var(--letter-spacing-l)',
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-neutral-medium)',
        textTransform: 'uppercase',
        lineHeight: 'var(--line-height-135)',
        marginBottom: '5px', // missing in the design token
      },
    },
    displayRangeContentBlock: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-s)',
        padding: 'var(--spacing-3) var(--spacing-3) var(--spacing-2)',
        '.review-rating-slider': {
          height: 'var(--spacing-1)',
          backgroundColor: '#f7f7f7', // missing in the design token
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
        lineHeight: 'var(--line-height-140)',
      },
    },
    pdpRatingDetailsCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        fontWeight: 500,
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-l)',
        margin: 0,
        lineHeight: 'var(--line-height-135)',
      },
    },
    pdpRatingDetailsContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        gap: 'var(--spacing-2)',
        alignItems: 'center',
      },
    },
    reviewCTAContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '18px 0 var(--spacing-3)', // missing in the design token
        pb: 0,
      },
    },
    reviewCTA: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-l'],
        ...reviewCTAButton,
        '& > div': {
          ml: 0,
        },
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
        marginBottom: 'var(--spacing-4)',
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
        fontWeight: 500,
      },
    },
    pdpReviewsDetailsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '14px', // missing in the design token,
      },
    },
    pdpReviewsDetailsTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        fontWeight: 500,
        marginTop: '10px', // missing in the design token
        marginBottom: '10px',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
    pdpReviewsDetailsDesc: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        marginTop: 'var(--spacing-2)',
      },
    }),
    pdpReviewsDetailsDescV3Closed: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
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
        marginTop: 'var(--spacing-2)',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 'auto',
      },
    },
    readMoreWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-2)',
        marginBottom: '6px', // missing in the design token
      },
    },
    readMore: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontFamily: 'var(--font-face1-normal)',
        textTransform: 'uppercase',
        fontSize: 'var(--text-10)',
        fontWeight: 500,
        letterSpacing: 'var(--letter-spacing-l)',
        lineHeight: 'var(--line-height-135)',
      },
    },
    pdpReviewsRatingDetailsInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-1) 10px 6px', // missing in the design token
        backgroundColor: '#f7f7f7', // missing in the design token
        border: 'var(--border-width-s) solid var(--border-color-inactive)',
        borderRadius: '40px', // missing in the design token
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
        backgroundColor: 'var(--color-background-cta-pill-bg)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    pdpReviewsHelpfulVoteup: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...pdpReviewsHelpfulVote,
        '&.upVoted': {
          background: 'var(--color-background-cta-primary)',
          borderColor: 'var(--color-border-cta-primary)',
          transition: 'background var(--transition-duration-gentle); ease',
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
    pdpReviewsHelpfulLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
      },
    },
    pdpReviewsHelpfulVoteCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-cta1-xs'],
        fontSize: 'var(--text-10)',
        color: 'var(--color-black)',
        lineHeight: 1,
        display: 'inline-flex',
        alignSelf: 'end',
        fontFamily: 'var(--font-face1-normal)',
        letterSpacing: 'var(--letter-spacing-l)',
        '&.side-text-animation': {
          animationName: 'text-slide',
          animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
          animationDuration: 'var(--transition-duration-gentle);',
          animationFillMode: 'backwards',
        },
      },
    },
    viewAllReviewCTAContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-3) 0px',
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
        backgroundColor: '#f7f7f7', // missing in the design token
        pb: '28px', // missing in the design token
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
        '&:has(+ .review-rating-range)': {
          mb: '22px', // missing in the design token
        },
      },
    },
    ratingWithPercentContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '26px auto var(--spacing-8)', // missing in the design token
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
        background: '#d9d9d9', // missing in the design token
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
        color: 'var(--color-neutral-medium)',
        fontWeight: 500,
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-l)',
        textTransform: 'uppercase',
      },
    },
    filterByLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-neutral-medium)',
        fontWeight: 500,
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
      },
    },
    pdpReviewmodalPaging: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-20)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-120)',
        marginBottom: '20px !important', // missing in the design token
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
        lineHeight: 'var(--line-height-140)',
        fontSize: 'var(--text-12)',
        '&:first-of-type': {
          paddingRight: 'var(--spacing-2)',
        },
      },
    },
    reviewRatingRange: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 0,
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
        height: '1px', // missing in the design token
        backgroundColor: '#24222233', // missing in the design token
      },
    },
    searchReviews: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-6)',
      },
    },
    rectangle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderLeft: 'var(--border-width-s) solid #d8d8d8', // missing in the design token
        paddingRight: 'var(--spacing-2)',
        height: '9px',
        marginTop: '5px', // missing in the design token
      },
    },
    imageReview: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-4)',
        marginBottom: 0,
      },
    },
    contentDividerTwo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        my: 0,
      },
    },
    starAndReviewCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 0,
      },
    },
    pdpReviewsClickableTag: (isSelected) => ({
      padding: '10px 14px',
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
    pdpReviewsClickableTagCount: {
      marginLeft: 'var(--spacing-1)',
      color: 'var(--neutrals-grey-600, #6D6D6D)',
    },
  }),
}
