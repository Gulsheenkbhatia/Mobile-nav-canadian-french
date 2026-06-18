const pdpReviewsHelpfulVote = {
  backgroundColor: 'var(--color-white-base)',
  borderRadius: 'var(--border-radius-s)',
  border: 'var(--border-width-s) solid #C4C4C4',
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
  borderColor: '#C4C4C4 !important', // missing in the design token
  color: 'var(--color-black-base)',
  fontSize: 'var(--text-12)',
  height: '50px',
  fontWeight: 800,
  lineHeight: 'var(--line-height-115)',
  letterSpacing: 'var(--letter-spacing-xl)',
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
          margin: isModalContent ? '15px 0px 0px' : '31px 0px 0px',
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
        margin: '14px 0 15px',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
    reviewHeaderContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'transparent',
        marginBottom: 0,
        padding: 0,
      },
    }),
    starSizesReviewItem: {
      width: '15px',
      height: '15px',
    },
    reviewHeader: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 0,
        '&.reviews__heading': {
          ...theme.typography['text-display1-m'],
          marginBottom: 0,
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 800,
          fontStyle: 'normal',
          textAlign: 'center',
          fontSize: 'var(--text-26)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
    }),
    displayRangeLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        fontWeight: 800,
        lineHeights: 'var(--line-height-135)',
        letterSpacings: 'var(--letter-spacing-l)',
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-black-base)',
        textTransform: 'uppercase',
        marginBottom: '5px', // missing in the design token
      },
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
        fontWeight: 500,
        fontFamily: 'var(--font-face1-normal)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeights: 'var(--line-height-135)',
      },
    },
    pdpRatingDetailsCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        fontWeight: 800,
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-black-base)',
        letterSpacing: 'var(--letter-spacing-s)',
        lineHeight: 'var(--chakra-lineHeights-normal)',
        margin: 0,
      },
    },
    pdpRatingDetailsContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        gap: 'var(--spacing-2)',
      },
    },
    reviewCTAContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-6) 0',
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
        fontWeight: 800,
      },
    },
    pdpReviewsRatingAgeRange: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        letterSpacing: 'var(--letter-spacing-l)',
        fontWeight: 800,
      },
    },
    pdpReviewsDetailsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '15px', // missing in the design token,
      },
    },
    pdpReviewsDetailsTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        letterSpacing: 'var(--letter-spacing-xs)',
        fontFamily: 'var(--font-face1-normal)',
        marginTop: '10px', // missing in the design token
        marginBottom: '10px',
        fontWeight: 800,
      },
    },
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
        marginBottom: '6px', // missing in the design token
      },
    },
    readMore: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontFamily: 'var(--font-face1-normal)',
        textTransform: 'uppercase',
        fontSize: 'var(--text-10)',
        fontWeight: 800,
        letterSpacing: 'var(--letter-spacing-s)',
        lineHeight: 'var(--line-height-135)', // missing in the design token
      },
    },
    pdpReviewsRatingDetailsInfo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-1) 10px',
        backgroundColor: 'var(--color-neutral-light)',
        border: 'var(--border-width-s) solid #C4C4C4', // missing in the design token
        borderRadius: '40px', // missing in the design token
        width: 'max-content',
        fontSize: 'var(--text-12)',
        fontWeight: 500,
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
    },
    reviewHelpfulContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-3)',
        marginTop: 'var(--spacing-4)',
        backgroundColor: '#F8F8F8', // missing in the design token
        borderRadius: 'var(--border-radius-s)',
      },
    },
    pdpReviewsHelpfulVoteup: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...pdpReviewsHelpfulVote,
        '&.upVoted': {
          background: '#427E2B', // missing in the design token
          borderColor: '#427E2B', // missing in the design token
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
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontWeight: 500,
      },
    },
    pdpReviewsHelpfulVoteCount: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-cta1-xs'],
        fontSize: 'var(--text-10)',
        fontWeight: 500,
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
        margin: 'var(--spacing-6) 0px 36px',
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
        fontWeight: 800,
      },
    },
    filterByLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-10)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-135)',
        letterSpacing: 'var(--letter-spacing-l)',
        textTransform: 'uppercase',
        fontWeight: 800,
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
        fontWeight: 500,
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        '&:first-of-type': {
          paddingRight: 'var(--spacing-2)',
        },
      },
    },
    reviewRatingRange: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '22px',
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
        backgroundColor: 'rgba(36,34,34,0.2)',
      },
    },
    searchReviews: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '-6px',
      },
    },
    rectangle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderLeft: '1px solid #D8D8D8',
        paddingRight: '6px',
        height: '9px',
        marginTop: '5px',
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
      backgroundColor: isSelected ? 'var(--color-black-base)' : 'var(--color-white-base)',
      border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
      borderRadius: 'var(--spacing-10)',
      width: 'max-content',
      '& path': {
        fill: theme.colors.main.white,
      },
    }),
    pdpReviewsClickableTagText: (isSelected) => ({
      ...theme.typography['text-body1-s'],
      fontSize: 'var(--text-12)',
      fontWeight: 500,
      color: isSelected ? 'var(--color-white-base)' : 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
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
          marginRight: '23px',
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            marginBottom: 0,
            color: 'var(--color-black-base)',
          },
        },
      }),
      reviewTitleWrapper: {
        maxWidth: 'max-content',
        paddingTop: '15px',
        marginBottom: '-5px',
      },
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          fontWeight: 500,
          margin: 'var(--spacing-3) 0 14px',
          lineHeight: 'var(--line-height-135)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewHeaderContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginRight: '23px',
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            marginBottom: 0,
            color: 'var(--color-black-base)',
          },
        },
      }),
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          fontWeight: 500,
          margin: 'var(--spacing-3) 0 14px',
          lineHeight: 'var(--line-height-135)',
        },
      },
    }),
  },
}
