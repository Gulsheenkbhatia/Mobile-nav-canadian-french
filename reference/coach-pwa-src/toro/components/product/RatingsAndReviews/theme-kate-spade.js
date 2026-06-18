export default {
  parts: [
    'pdpReviewsClickableTag',
    'reviewHelpfulContainer',
    'viewAllReviewCTA',
    'reviewHeader',
    'reviewSummaryContainer',
    'reviewSummaryTitle',
    'reviewSummaryContent',
    'reviewSummaryHintContainer',
    'reviewSummaryHintIcon',
    'reviewSummaryHintText',
    'reviewSummaryCta',
    'pdpReviewsDetailsDescV3Closed',
    'pdpReviewsDetailsDescV3Opened',
    'pdpReviewsRatingDetailsInfo',
    'reviewCTAContainer',
    'reviewTitleWrapper',
  ],
  baseStyle: ({ theme }) => ({
    reviewContentContainer: {
      py: '0px',
    },
    reviewModalBody: {
      pl: '12px',
      pr: '12px',
    },
    reviewContentMainContainer: ({ isDesktop }) => ({
      margin: isDesktop ? '0px 116px 40px' : '0px 0px 20px',
    }),
    reviewHeader: ({ isModalContent, isDesktop }) => ({
      mt: isModalContent ? 0 : isDesktop ? 'var(--spacing-12)' : 'var(--spacing-8)',
      color: 'var(--color-black-base)',
      '&.reviews__heading': {
        marginBottom: 0,
        textAlign: 'center',
      },
      ...theme.typography['text-display1-m'],
    }),
    contentDivider: {
      mt: { base: '0px', lg: 'var(--spacing-4)' },
      borderBottom: 'var(--border-width-s) dashed var(--color-black-base)',
      '::before': {
        display: 'none',
      },
    },

    reviewSummaryContainer: {
      flexDirection: 'column',
      marginTop: '0px',
      marginBottom: 'var(--spacing-2)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        maxWidth: '472px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '78px',
        marginBottom: '-12px',
        textAlign: 'center',
        alignItems: 'center',
      },
    },
    reviewSummaryTitle: {
      ...theme.typography['text-display2-s'],
      fontWeight: '400', // design token doesnt match Figma
      marginBottom: 'var(--spacing-2)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        marginBottom: 'var(--spacing-3)',
      },
    },
    reviewSummaryContent: {
      ...theme.typography['text-title2-s'],
      fontWeight: '500', // design token doesnt match Figma
      marginBottom: 'var(--spacing-3)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-m'],
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
      ...theme.typography['text-title2-xs'],
      fontWeight: '500', // design token doesnt match Figma

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontWeight: '400',
      },
    },

    reviewSummaryCta: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-cta2-s'],
        borderRadius: 'var(--border-radius-xs)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        marginTop: '18px',
        marginBottom: 'var(--spacing-6)',
        textTransform: 'uppercase',
        display: 'flex',
        gap: '10px',
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
          paddingTop: '0px',
        },
      },
    },

    pdpRatingDetailsPoints: {
      ...theme.typography['text-body1-s'],
    },
    pdpRatingDetailsCount: {
      ...theme.typography['text-body1-s'],
    },
    reviewCTA: {
      ...theme.typography['text-cta1-m'],
    },
    overallFitContainer: {
      ...theme.typography['text-body1-l'],
    },
    displayRangeContainerSize: {
      ...theme.typography['text-body1-s'],
    },
    pdpReviewsRatingDetailsUserInfo: {
      ...theme.typography['text-body2-m'],
    },
    pdpReviewsRatingDetailsInfo: {
      ...theme.typography['text-body2-m'],
    },
    pdpReviewsDetailsTitle: {
      fontWeight: 'normal',
      ...theme.typography['text-display1-s'],
    },
    pdpReviewsDetailsDesc: () => ({
      mt: 'var(--spacing-4)',
      fontWeight: 'normal',
      overflow: 'hidden',
      ...theme.typography['text-body2-m'],
    }),
    readMore: {
      ...theme.typography['text-cta1-s'],
    },
    pdpReviewsHelpfulLabel: {
      ...theme.typography['text-body1-m'],
    },
    pdpReviewsHelpfulVoteCount: {
      ...theme.typography['text-body2-s'],
    },
    viewAllReviewCTA: {
      ...theme.typography['text-cta1-m'],
    },
    ratingStarCount: {
      ...theme.typography['text-body1-s'],
    },
    ratingStarPercent: {
      ...theme.typography['text-body1-s'],
    },
    ratingsFilterFormSearchBar: {
      '::placeholder': {
        color: 'var(--color-neutral-base)',
        ...theme.typography['text-body1-l'],
      },
    },
    sortByLabel: {
      ...theme.typography['text-body1-m'],
    },
    filterByLabel: {
      ...theme.typography['text-body1-m'],
    },
    filterDropdownText: {
      color: 'var(--color-neutral-base)',
      ...theme.typography['text-body1-l'],
      option: {
        color: 'var(--color-neutral-base)',
        ...theme.typography['text-body1-l'],
      },
    },
    pdpReviewmodalPaging: {
      ...theme.typography['text-body2-s'],
    },
    starSapcing: {
      spacing: 'var(--spacing-2)',
    },
    starWrapper: (isMobile) => ({
      mb: isMobile ? 'var(--spacing-2)' : 'var(--spacing-4)',
    }),
    starHeaderWrapper: {
      mb: 'var(--spacing-4)',
    },
    pdpReviewsDetailsWrapper: {
      mb: 'var(--spacing-6)',
    },
  }),
  variants: {
    tabbedPDPReviewList: ({ theme }) => ({
      pdpReviewsDetailsDesc: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        overflow: 'hidden',
      }),
      pdpReviewsDetailsDescV3Closed: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-4)',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        },
      },
      pdpReviewsDetailsDescV3Opened: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-4)',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 'auto',
        },
      },
      pdpReviewsDetailsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: 'var(--spacing-4)',
        },
      },
      pdpReviewsHelpfulVoteup: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
      pdpReviewsHelpfulVoteCount: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
        },
      },
      pdpReviewsHelpfulVotedown: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3)',
          backgroundColor: 'var(--color-product-image-bg)',
        },
      }),
      pdpReviewsRatingDetailsUserInfo: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-badge1-xs'],
        },
      },
      pdpReviewsRatingAgeRange: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-badge1-xs'],
        },
      },
      pdpReviewsRatingDetailsInfo: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--border-color-inactive)',
        },
      },
      reviewHelpfulContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-product-image-bg)',
        },
      },
      viewAllReviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          borderColor: 'var(--color-neutral-inactive)',
        },
      },

      pdpReviewsDetailsTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display2-s'],
          marginTop: 'var(--spacing-4)',
        },
      },
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            marginTop: 'var(--spacing-2)',
            justifyContent: 'space-between',
            display: 'flex',
            gap: 'var(--spacing-6)',
          },
          '.no-reviews': {
            flexDirection: 'column',
            alignItems: 'start',
            gap: 'unset',
            marginTop: '19px',
          },
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display2-xl'],
            fontSize: 'var(--text-72)',
            color: 'var(--color-black-base)',
          },
        },
      }),
      reviewTitleWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& h2.reviews__heading': {
            marginTop: 0,
            marginBottom: 0,
            color: 'var(--color-black-base)',
            fontFamily: 'var(--font-face2-normal)',
            fontWeight: 700,
            fontStyle: 'normal',
            textAlign: 'left',
            fontSize: 'var(--text-26)',
            lineHeight: 'var(--line-height-s)',
          },
        },
      },
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-3) 0 13px',
        },
      },
      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '18px 0 var(--spacing-6)',
        },
      },
      reviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: 'var(--spacing-3) var(--spacing-4)',
        },
      },

      reviewsRatingLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
        },
      },
      wordCloudTagsText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-3)',
          color: 'var(--color-black-base)',
        },
      },
      clickableTagsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 0,
        },
      },
      pdpReviewsClickableTag: (isSelected) => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '3px var(--spacing-3)',
          backgroundColor: isSelected ? 'var(--color-black-base)' : 'var(--color-white-base)',
          border: 'var(--border-width-s) solid var(--color-neutral-light-3)',
          borderRadius: 'var(--spacing-10)',
          width: 'max-content',
          '& path': {
            fill: theme.colors.main.white,
          },
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      pdpReviewsDetailsDesc: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        overflow: 'hidden',
      }),
      pdpReviewsDetailsDescV3Closed: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-4)',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        },
      },
      pdpReviewsDetailsDescV3Opened: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-4)',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 'auto',
        },
      },
      pdpReviewsDetailsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: 'var(--spacing-4)',
        },
      },
      pdpReviewsHelpfulVoteup: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
      pdpReviewsHelpfulVoteCount: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
        },
      },
      pdpReviewsHelpfulVotedown: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3)',
          backgroundColor: 'var(--color-product-image-bg)',
        },
      }),
      pdpReviewsRatingDetailsUserInfo: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-badge1-xs'],
        },
      },
      pdpReviewsRatingAgeRange: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-badge1-xs'],
        },
      },
      pdpReviewsRatingDetailsInfo: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderColor: 'var(--color-neutral-inactive)',
        },
      },
      reviewHelpfulContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-product-image-bg)',
        },
      },
      viewAllReviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-l'],
          borderColor: 'var(--color-neutral-inactive)',
        },
      },

      pdpReviewsDetailsTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display2-s'],
          marginTop: 'var(--spacing-4)',
        },
      },
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            marginTop: 'var(--spacing-6)',
            justifyContent: 'left',
            display: 'flex',
            gap: 'var(--spacing-6)',
          },
          '.no-reviews': {
            flexDirection: 'column',
            alignItems: 'start',
            gap: 'unset',
            marginTop: '19px',
          },
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display2-xl'],
            fontSize: 'var(--text-72)',
            color: 'var(--color-black-base)',
          },
        },
      }),
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-3) 0 13px',
        },
      },
      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '18px 0 var(--spacing-6)',
        },
      },
      reviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: 'var(--spacing-3) var(--spacing-4)',
        },
      },

      reviewsRatingLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
        },
      },
      wordCloudTagsText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          marginTop: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-3)',
          color: 'var(--color-black-base)',
        },
      },
      clickableTagsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 0,
        },
      },
      pdpReviewsClickableTag: (isSelected) => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '3px var(--spacing-3)',
          backgroundColor: isSelected ? 'var(--color-black-base)' : 'var(--color-white-base)',
          border: 'var(--border-width-s) solid var(--color-neutral-light-3)',
          borderRadius: 'var(--spacing-10)',
          width: 'max-content',
          '& path': {
            fill: theme.colors.main.white,
          },
        },
      }),
    }),
  },
}
