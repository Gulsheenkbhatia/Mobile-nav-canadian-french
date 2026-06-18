export default {
  parts: [
    'reviewsSectionRootWrapper',
    'reviewHeaderContainer',
    'reviewTitleWrapper',
    'reviewHeader',

    'reviewListItemContainer',
    'reviewListItemContainerLeftChild',
    'pdpReviewsRatingDetailsUserInfo',
    'pdpReviewsRatingDetailsInfo',
    'pdpReviewsRatingUserProfile',
    'pdpReviewsRatingAgeRange',
    'pdpReviewsHelpfulLabel',
    'pdpReviewsHelpfulVoteup',
    'reviewRatingVoteThumbs',
    'pdpReviewsHelpfulVoteCount',
    'pdpReviewsHelpfulVotedown',
    'reviewBadgeContainer',
    'thumbsIconsSize',

    'pdpReviewsDetailsWrapper',
    'pdpReviewsDetailsTitle',
    'pdpReviewsDetailsDesc',
    'readMoreWrapper',
    'readMore',

    'pdpRatingDetailsPoints',
    'pdpRatingDetailsCount',

    'displayRangeContainer',
    'displayRangeContainerSize',

    'ratingWithPercentContainer',
    'fullStarContainer',
    'ratingStarCount',
    'ratingStarProgressBarSuperContainer',
    'ratingStarProgressBarContainer',
    'ratingStarProgressBar',
    'ratingStarPercent',

    'ratingsFilterFormSearchBar',
    'searchBarIcon',
    'sortByWrapper',
    'sortByLabel',
    'filterByLabel',
    'clearFilterStyle',
    'pdpReviewmodalFiltersApplied',
    'pdpReviewmodalPaging',

    'reviewSummaryContainer',
    'reviewSummaryTitle',
    'reviewSummaryContent',
    'reviewSummaryHintContainer',
    'reviewSummaryHintIcon',
    'reviewSummaryHintText',
    'reviewSummaryCta',

    'reviewContentMainContainer',
    'reviewContentContainer',
    'reviewTitleContainer',
    'noResultReviewsMessage',
    'reviewCTAContainer',
    'reviewCTA',
    'ratingWithPercentMainContainer',
    'ratingWithPercentModalContainer',
    'overallFitContainer',
    'modalReviewOverlay',
    'contentDivider',
    'contentDividerTwo',
    'viewAllReviewCTAContainer',
    'viewAllReviewCTA',
    'reviewModalContent',
    'reviewModalBody',
    'reviewModalHeader',
    'reviewModalCloseButton',
    'filterDropdownText',
    'imageReview',
    'pdpReviewsClearTagsContainer',
    'pdpReviewsClearTags',
    'pdpRatingDetailsContainer',
    'reviewsRatingLabel',
    'wordCloudTagsText',
    'clickableTagsContainer',
    'pdpReviewsClickableTagCount',
    'fitSizesContainer',
    'reviewRatingRange',
    'ratingInformationBox',

    'emplifiDisclaimerTextContainer',
    'emplifiDisclaimerTermsLink',
    'incentivizedReview',
  ],
  baseStyle: ({ theme }) => ({
    reviewsSectionRootWrapper: {
      pt: '10px',
    },
    reviewHeaderContainer: (isModalContent, isReviewSectionUnderProductImage) => ({
      background: theme.colors.main.white,
      mb: isReviewSectionUnderProductImage ? theme.space.m : theme.space.xl,
      top: '0px',
      pt: isModalContent ? '15px' : 0,
      pb: isModalContent ? '20px' : 0,
    }),
    reviewHeader: ({ isModalContent, isDesktop, isReviewSectionUnderProductImage }) => ({
      mt: isModalContent ? 0 : isDesktop && !isReviewSectionUnderProductImage ? '43px' : '32px',
      fontFamily: theme.fontFamily.primaryBold,
      letterSpacing: '0.2px',
      '&.reviews__heading': {
        marginBottom: 0,
        fontSize: '1.25rem',
        fontFamily: 'var(--font-face1-bold)',
        lineHeight: 1.2,
        letterSpacing: '0.2px',
        textAlign: 'center',
        '@media (min-width: 769px)': {
          fontSize: '26px',
        },
      },
    }),
    reviewListItemContainer: {
      borderBottom: '1px solid #d8d8d8',
      p: '32px 0',
    },
    ratingInformationBox: {
      mb: '16px',
      mr: '24px',
    },
    imageReview: {
      borderRadius: 'var(--border-radius-s)',
      marginBottom: 'var(--spacing-4)',
      width: 'auto',
      maxHeight: '400px',
    },
    pdpReviewsRatingDetailsUserInfo: {
      fontSize: theme.fontSizes.sm,
      fontWeight: 'normal',
      lineHeight: '1.4',
      color: theme.colors.main.black,
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    pdpReviewsRatingUserProfile: {
      display: 'flex',
      flexDirection: 'column',
    },
    pdpReviewsRatingAgeRange: {
      fontSize: theme.fontSizes.xxs,
      fontWeight: 'normal',
      lineHeight: 'var(--line-height-135)',
      color: theme.colors.main.black,
      fontFamily: theme.fontFamily.primaryNormal,
      textTransform: 'uppercase',
    },
    pdpReviewsRatingDetailsInfo: {
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
      lineHeight: '1.4',
      color: theme.colors.main.black,
      maxWidth: '100%',
    },
    incentivizedReview: {
      gap: '4px',
      mt: '-5px',
      '& .incentivized-review-content': {
        borderRadius: 'var(--border-radius-l)',
        border: 'none',
        w: '196px',
        backgroundColor: 'var(--color-neutral-dark)',
        _focus: { outline: 'none' },
      },
      '& .incentivized-review-title': {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontWeight: '500',
      },
      '& .incentivized-review-icon': {
        mt: '3px',
        "& svg > use[href='#icon-form-error-outline']": {
          color: 'var(--color-black-base)',
        },
      },
      '& .incentivized-review-body': {
        gap: '8px',
        p: '14px var(--spacing-2)',
        maxW: '196px',
        alignItems: 'center',
        flexDirection: 'column',
      },
      '& .incentivized-review-body-button': {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        backgroundColor: 'var(--color-white-base)',
        cursor: 'pointer',
        w: '88px',
        textTransform: 'none',
        p: '10px var(--spacing-6) var(--spacing-2) var(--spacing-6)',
        borderRadius: '100px',
        fontWeight: '500',
      },
      '& .incentivized-review-body-text': {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-white-base)',
        textAlign: 'center',
        fontWeight: '500',
      },
    },
    pdpReviewsHelpfulLabel: {
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.main.black,
      fontWeight: 'normal',
      mr: '16px',
    },
    pdpReviewsHelpfulVoteup: {
      color: theme.colors.main.darkGray,
      fontWeight: 'normal',
      mr: '16px',
    },
    reviewRatingVoteThumbs: {
      mr: '8px',
    },
    pdpReviewsHelpfulVoteCount: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.sm,
    },
    pdpReviewsHelpfulVotedown: {
      color: theme.colors.main.darkGray,
      fontWeight: 'normal',
      mr: '16px',
    },

    reviewSummaryContainer: {
      flexDirection: 'column',
      marginTop: 'var(--spacing-2)',
      marginBottom: 'var(--spacing-4)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        maxWidth: '472px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '58px',
        marginBottom: '-16px',
        textAlign: 'center',
        alignItems: 'center',
      },
    },
    reviewSummaryTitle: {
      ...theme.typography['text-title2-m'],
      marginBottom: 'var(--spacing-2)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display1-s'],
        marginBottom: 'var(--spacing-2)',
      },
    },
    reviewSummaryContent: {
      ...theme.typography['text-title1-m'],
      fontWeight: '400', // design token doesnt match Figma
      marginBottom: 'var(--spacing-3)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body2-m'],
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
      ...theme.typography['text-title1-xs'],
      fontWeight: '400', // design token doesnt match Figma

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
      },
    },

    reviewSummaryCta: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-cta1-s'],
        borderRadius: 'var(--border-radius-xs)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        marginTop: '18px',
        marginBottom: '18px',
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

    reviewBadgeContainer: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.sm,
      fontWeight: 'normal',
    },
    pdpReviewsDetailsWrapper: {
      mb: '16px',
      wordBreak: 'break-word',
    },
    pdpReviewsDetailsTitle: {
      fontFamily: 'var(--font-face1-bold)',
      fontSize: theme.fontSizes.lg,
      lineHeight: '1.2',
      color: theme.colors.main.black,
      marginBottom: '10px',
    },
    pdpReviewsDetailsDesc: ({ isDesktop }) => ({
      mt: '16px',
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: isDesktop ? '16px' : theme.fontSizes.sm,
      fontWeight: 'normal',
      lineHeight: '1.4',
      color: 'var(--color-black-base)',
      overflow: 'hidden',
    }),
    readMoreWrapper: {
      mt: '8px',
      fontSize: theme.fontSizes.xs,
      fontWeight: 'normal',
      color: theme.colors.main.black,
    },
    readMore: {
      mr: '5px',
    },
    pdpRatingDetailsPoints: {
      fontSize: theme.fontSizes.xs,
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
      fontWeight: 'normal',
      lineHeight: '1.4',
      mr: '8px',
      ml: '8px',
    },
    pdpRatingDetailsCount: {
      fontSize: theme.fontSizes.xs,
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
      fontWeight: 'normal',
      lineHeight: '1.4',
      mr: '8px',
      ml: '8px',
    },
    displayRangeContainer: {
      color: theme.colors.main.black,
    },
    displayRangeContainerSize: {
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: '400',
    },
    ratingWithPercentContainer: {
      mt: '10px',
      mb: '10px',
      color: theme.colors.main.black,
    },
    fullStarContainer: {
      mr: '18px',
    },
    ratingStarCount: {
      mr: '10px',
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    ratingStarProgressBarSuperContainer: {
      mr: '10px',
    },
    ratingStarProgressBarContainer: {
      height: '8px',
      bg: theme.colors.main.inactive,
      borderRadius: '4px',
    },
    ratingStarProgressBar: {
      bg: theme.colors.main.darkGray,
      borderRadius: '4px',
    },
    ratingStarPercent: {
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    ratingsFilterFormSearchBar: {
      border: '1px solid',
      borderRadius: theme.borderRadius,
      padding: '10px 10px 9px 16px',
      _focus: { border: '1px solid' },
      borderColor: theme.colors.main.inactive,
      focusBorderColor: theme.colors.main.black,
    },
    searchBarIcon: {
      color: theme.colors.main.black,
    },
    sortByWrapper: {
      spacing: '18px',
    },
    sortByLabel: {
      fontSize: 'sm',
      color: theme.colors.main.black,
    },
    filterByLabel: {
      fontSize: 'sm',
      color: theme.colors.main.black,
    },
    pdpReviewmodalFiltersApplied: {
      borderRadius: 'full',
      color: theme.colors.main.gray,
      padding: '4px 8px',
    },
    pdpReviewmodalPaging: {
      fontSize: 'sm',
      fontWeight: 'normal',
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    reviewContentMainContainer: ({ isDesktop, isReviewSectionUnderProductImage }) => ({
      margin: isDesktop
        ? isReviewSectionUnderProductImage
          ? '0px 0px 40px 116px'
          : '0px 116px 40px'
        : isReviewSectionUnderProductImage
        ? '0px 0px 20px'
        : '0px 16px 20px',
    }),
    reviewContentContainer: {
      py: '4px',
    },
    reviewTitleContainer: (isModalContent, isDesktop) => ({
      mx: isModalContent ? 0 : isDesktop ? '1%' : 0,
    }),
    noResultReviewsMessage: {
      textAlign: 'center',
      fontSize: theme.fontSizes.sm,
      fontWeight: '400',
      lineHeight: theme.lineHeights.xl,
      fontFamily: theme.fontFamily.secondaryNormal,
    },
    reviewCTAContainer: {
      mt: '32px',
      pb: '32px',
    },
    reviewCTAContainerUnderImage: {
      mt: theme.space.m,
    },
    reviewCTA: {
      border: '1px solid #d8d8d8 !important',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.main.primary,
      lineHeight: theme.lineHeights.xs,
      _focus: { border: '2px solid black' },
      letterSpacing: '1.25px',
      width: { base: '100%', lg: '320px' },
      minHeight: { base: '50px', lg: '48px' },
    },
    ratingWithPercentMainContainer: {
      m: '0 auto',
    },
    ratingWithPercentModalContainer: {
      mt: '32px',
      mb: '32px',
    },
    contentDivider: {
      mt: '31px',
    },
    contentDividerUnderImage: {
      mt: theme.space.l,
    },
    contentDividerTwo: {
      my: '32px',
    },
    overallFitContainer: {
      lineHeight: '1.35',
      fontSize: theme.fontSizes.md,
      color: theme.colors.main.black,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: '500',
    },
    viewAllReviewCTAContainer: (isDesktop, isReviewSectionUnderProductImage) => ({
      textAlign: 'center',
      mt: isReviewSectionUnderProductImage ? '40px' : '48px',
      mb: isDesktop ? '8px' : '48px',
    }),
    viewAllReviewCTA: {
      border: '1px solid #d8d8d8 !important',
      fontSize: theme.fontSizes.sm,
      lineHeight: '1.15',
      width: { base: '100%', lg: 'auto' },
      minHeight: { base: '50px', lg: '48px' },
    },
    modalReviewOverlay: {
      opacity: '0.8 !important',
      background: theme.colors.main.black,
    },
    reviewModalContent: {
      marginTop: '0',
      marginBottom: '0',
    },
    reviewModalBody: {
      p: '0',
      overflowY: 'scroll',
      overflowX: 'hidden',
      background: theme.colors.main.white,
      '&::-webkit-scrollbar': {
        width: '14px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.neutral.light,
      },
      '&::-webkit-scrollbar-thumb': {
        height: '220px',
        background: theme.colors.neutral.base,
        backgroundClip: 'padding-box',
        border: '4px solid white',
        borderRadius: '7px',
      },
    },
    reviewModalHeader: {
      boxShadow: 'none',
      background: 'transparent',
    },
    reviewModalCloseButton: {
      _focus: { border: 'none', background: 'none' },
      _hover: { background: 'none' },
      color: theme.colors.main.black,
    },
    starWrapper: () => ({
      mb: '10px',
    }),
    starHeaderWrapper: {
      mb: 'var(--spacing-4)',
    },
    thumbsIconsSize: {
      width: '12.6',
      height: '12.8',
      viewBox: '0 0 16 16',
    },
    thumbsIconsSizeV3: {
      width: '10.45',
      height: '10.45',
      viewBox: '0 0 18 17',
    },
    pdpReviewsClearTagsContainer: {
      flexWrap: 'wrap',
      alignItems: 'center',
      mt: '2',
    },
    pdpReviewsClearTags: {
      color: theme.colors.main.black,
      textTransform: 'none',
      textDecoration: 'underline',
      fontWeight: '400',
      ...theme.typography['text-body1-s'],
      fontSize: 'var(--text-14)',
    },
    clickableTagsContainer: {
      margin: 'var(--spacing-2) 0',
    },
    emplifiDisclaimerTextContainer: {
      paddingTop: '32px',
      fontSize: '0.75rem',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        paddingTop: '12px',
      },
    },
    emplifiDisclaimerTermsLink: {
      textDecoration: 'underline',
    },
  }),
  variants: {
    tabbedPDPReviewList: ({ theme }) => ({
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3)',
          backgroundColor: 'var(--color-neutral-light)',
        },
      }),
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            marginTop: 'var(--spacing-2)',
            justifyContent: 'space-between',
            display: 'flex',
          },
          '.no-reviews': {
            flexDirection: 'column',
            alignItems: 'start',
            marginTop: '19px',
          },
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            marginBottom: 0,
            color: 'var(--color-black-base)',
            fontFamily: 'var(--font-face1-bold)',
            fontSize: 'var(--text-60)',
            lineHeight: 'var(--line-height-115)',
          },
        },
      }),
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-16)',
        },
      },
      pdpRatingDetailsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-2)',
        },
      },
      reviewsRatingLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          marginTop: 'var(--spacing-2)',
        },
      },
      wordCloudTagsText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          marginTop: '6px',
        },
      },
      clickableTagsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& > div': {
            gap: 'var(--spacing-2)',
            '& > div': {
              margin: '0',
            },
          },
        },
      },
      fitSizesContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: 'var(--spacing-6)',
          marginTop: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        },
      },
      reviewRatingRange: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: { marginTop: '0px', marginBottom: '0px' },
      },
      ratingInformationBox: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
        },
      },
      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '100%',
        },
      },
      reviewModalHeader: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          position: 'sticky',
          top: '0',
        },
      },
      reviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          svg: {
            marginLeft: 'var(--spacing-2)',
          },
        },
      },
      reviewModalBody: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&::-webkit-scrollbar': {
            width: '14px',
          },
          '&::-webkit-scrollbar-thumb': {
            height: '220px',
          },
        },
      },
      displayRangeContainerSize: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
      readMore: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          lineHeight: 'var(--line-height-135)',
          letterSpacing: 'var(--letter-spacing-xl)',
        },
      },
      emplifiDisclaimerTextContainer: {
        marginTop: 'var(--spacing-6)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: 0,
        },
        ...theme.typography['text-body1-s'],
      },
      emplifiDisclaimerTermsLink: {
        textDecoration: 'underline',
        ...theme.typography['text-body1-s'],
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewContentMainContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3)',
        },
      }),
      reviewTitleContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.reviews-info-details': {
            marginTop: 'var(--spacing-2)',
            justifyContent: 'left',
            display: 'flex',
          },
          '.no-reviews': {
            flexDirection: 'column',
            alignItems: 'start',
            marginTop: '19px',
          },
        },
      }),
      reviewHeader: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.reviews__heading': {
            ...theme.typography['text-display1-2xl'],
            marginBottom: 0,
            color: 'var(--color-black-base)',
            fontFamily: 'var(--font-face1-bold)',
            fontSize: 'var(--text-60)',
            lineHeight: 'var(--line-height-115)',
          },
        },
      }),
      noResultReviewsMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-16)',
        },
      },
      pdpRatingDetailsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-2)',
        },
      },
      reviewsRatingLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          marginTop: 'var(--spacing-2)',
        },
      },
      wordCloudTagsText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          marginTop: '6px',
        },
      },
      clickableTagsContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& > div': {
            gap: 'var(--spacing-2)',
            '& > div': {
              margin: '0',
            },
          },
        },
      },
      fitSizesContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: 'var(--spacing-6)',
          marginTop: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        },
      },
      reviewRatingRange: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: { marginTop: '0px', marginBottom: '0px' },
      },
      ratingInformationBox: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
        },
      },
      reviewCTAContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '100%',
        },
      },
      reviewModalHeader: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          position: 'sticky',
          top: '0',
        },
      },
      reviewCTA: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          svg: {
            marginLeft: 'var(--spacing-2)',
          },
        },
      },
      reviewModalBody: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&::-webkit-scrollbar': {
            width: '14px',
          },
          '&::-webkit-scrollbar-thumb': {
            height: '220px',
          },
        },
      },
      displayRangeContainerSize: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
      readMore: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          lineHeight: 'var(--line-height-135)',
          letterSpacing: 'var(--letter-spacing-xl)',
        },
      },
      emplifiDisclaimerTextContainer: {
        marginTop: 'var(--spacing-6)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: 0,
        },
        ...theme.typography['text-body1-s'],
      },
      emplifiDisclaimerTermsLink: {
        textDecoration: 'underline',
        ...theme.typography['text-body1-s'],
      },
    }),
  },
}
