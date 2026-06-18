const adaptiveButtonWrapper = {
  gridGap: 0,
  borderRadius: '3px',
  border: '1px solid var(--color-neutral-inactive)',
}

export default {
  parts: [
    'pdpBadgeOnImage',
    'pdpMainContainerWrapper',
    'pdpMainContent',
    'drawerSelectoptionWrapper',
    'pdpRedirectLink',
    'quantitySelector',
    'leftItem',
    'stickyPriceWrapper',
    'stickyAddToBagWrapper',
    'stickyAddToCartPriceContainer',
    'viewProductDetailsStyles',
    'breadCrumbWrapperContainer',
    'customizedContainer',
    'selectorWrapper',
    'atbWrapper',
    'atbNotifyMeWrapper',
    'atbWrapperGridGap',
    'addToBagCTAButtons',
    'buyNowWrapper',
    'NotifyMeWrapper',
    'AddToBagCTAWrapper',
    'addToBagCTABorder',
    'addToBagCTAQuantitySelectorEnable',
    'applePayWrapper',
  ],
  baseStyle: ({ theme }) => ({
    leftItem: {
      'div:nth-child(2)': {
        textTransform: 'none',
        fontWeight: 'var(--chakra-fontWeights-normal)',
      },
    },
    buyNowWrapper: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-3)',
      },
    },
    buyNowButton: {
      width: '100%',
      borderRadius: 'var(--border-radius-s)',
      color: 'var(--color-black-base)',
      flexBasis: '100%',
      display: 'flex',
      '&:disabled, &:hover:disabled': {
        background: 'var(--color-background-cta-disabled)',
        color: 'var(--color-neutral-medium)',
        opacity: 1,
      },
    },
    applePayWrapper: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-3)',
      },
      width: '100%',
      '& button': {
        padding: 'var(--apple-pay-button-padding, 16px 24px)',
        width: '100% !important',
        border: '1px solid var(--color-black-base)',
      },
      '&.applePayContainer-disabled': {
        opacity: 0.3,
        pointerEvents: 'none',
        '& button': {
          '-apple-pay-button-style': 'black',
        },
      },
      flexGrow: 1,
    },
    pdpBadgeOnImage: ({ isDesktop }) => ({
      mt: '5px',
      left: isDesktop ? '125px' : 'var(--spacing-4)',
    }),
    pdpMainContainerWrapper: {
      p: '18px 12px',
      '&:empty': {
        display: 'none',
      },
      '&:has(#pdpv5)': {
        backgroundColor: 'var(--color-page-bg)',
        padding: '0',
      },
      '&.pdpv5_1': {
        backgroundColor: 'var(--color-page-bg)',
        overflowX: 'visible',
        '& .zoomModal': {
          backgroundColor: 'var(--color-page-bg)',
        },
      },
    },
    drawerSelectoptionWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        pb: theme.space.s,
        mb: theme.space.l,
        borderBottom: '1px solid #d8d8d8',
      },
    },
    drawerSelectoptionWrapperText: {
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: theme.fontSizes.xs,
    },
    productDetailsWrapper: {
      pr: 'mar',
      flexDirection: 'column',
    },
    mobileHeroContainer: () => ({
      mb: theme.space.l,
    }),
    LazyRatingsAndReviews: (isDesktop) => ({
      margin: isDesktop ? '0px 116px 40px' : '0px 16px 20px',
    }),
    addToBagCTA: () => ({}),
    addToBagCTAButtons: {
      flexWrap: 'wrap',
      gridGap: '0.75rem',
      '&>div': {
        flexBasis: 'auto',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& .buy-now-button-wrapper': {
          flexGrow: '1',
        },
      },
    },
    addToBagWithSmallerText: {
      '&>div': {
        flexBasis: 0,
      },
      '& .applePayContainer': {
        height: '57px',
        marginTop: 'var(--spacing-2)',
        '& .adyen-checkout__applepay__button': {
          minWidth: 'unset',
          height: '57px',
        },
      },
    },
    addToBagCTAQuantitySelectorEnable: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& .buy-now-button-wrapper': {
          flexBasis: '100%',
        },
        '& .applePayContainer': {
          marginTop: 'calc(-1 * var(--spacing-1))',
        },
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        '& .buy-now-button-wrapper': {
          flexGrow: '1',
        },
      },
    },
    stickyPriceWrapper: {
      alignItems: 'center',
    },
    stickyAddToBagWrapper: {
      flexGrow: '1',
      flexWrap: 'wrap',
    },
    stickyAddToCartPriceContainer: {
      mr: '15.5px',
      '& .discount-percent': {
        mr: '8.5px',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexGrow: '1',
        alignSelf: 'self-start',
        mr: '0',
        '& .discount-percent': {
          mr: 'var(--spacing-1)',
        },
      },
    },
    ReviewAndRating: (bundle, totalReviews, averageRating) => ({
      mt: bundle ? '10px' : '0px',
      minHeight: (totalReviews > 0 || averageRating > 0) && '16px',
    }),
    breadCrumbWrapperContainer: {
      mt: '16px',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    customizedContainer: {
      '&:has(.klarna-container) .customization_cta': {
        mt: 'var(--spacing-4)',
      },
    },
    atbWrapper: {
      gridGap: 'var(--spacing-3)',
      '.chakra-select__wrapper': {
        mt: 0,
      },
    },
    atbNotifyMeWrapper: {
      mt: 'var(--spacing-3)',
    },
    atbWrapperGridGap: {
      gridGap: 'var(--spacing-3)',
    },
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      selectorWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-2)',
          '.chakra-select__wrapper': {
            height: '57px',
          },
        },
        [`@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`]: {
          '.chakra-select__wrapper': {
            marginTop: 'var(--spacing-2)',
          },
          '.chakra-select__wrapper select': {
            height: '57px',
          },
        },
      },
      atbWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            mt: 'var(--spacing-2)',
          },
        },
        [`@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`]: {
          '.chakra-select__wrapper': {
            marginTop: 'var(--spacing-2)',
          },
          '.chakra-select__wrapper select': {
            height: '57px',
          },
        },
      },
      atbNotifyMeWrapper: {
        mt: 'var(--spacing-2)',
      },
      atbWrapperGridGap: {
        gridGap: 0,
        columnGap: 'var(--spacing-2)',
      },
    }),
    quickview: ({ theme }) => ({
      pdpMainContainerWrapper: {
        p: '40px 0',
        '.hidden-on-quickview': {
          display: 'none !important',
        },
      },
      pdpMainContent: {
        pr: '30px',
      },
      pdpRedirectLink: {
        fontSize: theme.fontSizes.sm,
      },
      viewProductDetailsStyles: {
        pl: 'var(--chakra-space-xxxl)',
      },
    }),
    mobile: () => ({
      mobileBreadcrumbContainer: {
        pl: 'mar',
        pr: 'mar',
      },
      mobileMainContainer: {
        p: 'mar',
      },
    }),
    tabbedPDP: ({ theme }) => ({
      addToBagCTAButtons: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridGap: 'var(--spacing-2)',
          '.chakra-select__wrapper': {
            mt: 'var(--spacing-2)',
          },
        },
      },
      AddToBagCTAWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .product-info-message-alert, & .product-info-message': {
            mb: 0,
          },
        },
      },
      atbWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gridGap: 'var(--spacing-2)',
          '.chakra-select__wrapper': {
            mt: 'var(--spacing-2)',
          },
        },
      },
      buyNowWrapper: {
        '& button.buy-now-button': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-cta1-s'],
            height: '48px',
            borderRadius: 'var(--border-radius-xs)',
          },
        },
      },
      applePayWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-3)',
        },
      },
      NotifyMeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .product-info-message-alert, & .product-info-message': {
            mt: 0,
            mb: 0,
          },
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagCTAQuantitySelectorEnable: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .buy-now-button-wrapper': {
            flexBasis: 0,
          },
        },
      },
      addToBagCTAButtons: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...adaptiveButtonWrapper,
          '& .chakra-select__wrapper': {
            '& svg': {
              color: 'white',
            },
          },
        },
      },
      atbWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...adaptiveButtonWrapper,
        },
      },
      atbWrapperGridGap: {
        ...adaptiveButtonWrapper,
      },
      buyNowWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          minWidth: '50%',
          '& button.buy-now-button': {
            fontFamily: 'var(--font-face1-extended-normal)',
            marginTop: 0,
            borderRadius: 0,
            backgroundColor: 'var(--color-white-base)',
            color: 'var(--color-black-base)',
            textTransform: 'capitalize',
            fontSize: 'var(--text-14)',
            height: '56px',
            letterSpacing: 'var(--letter-spacing-xs)',
            lineHeight: 1,
            paddingTop: '20px',
          },
        },
      },
      applePayWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'auto',
          minWidth: '50%',
          '& .adyen-checkout__applepay__button': {
            display: 'flex',
            height: '40px',
            margin: '8px 0px',
            borderRadius: 0,
            border: 'none',
            minWidth: '50%',
          },
          '& .merchant-checkout__payment-method': {
            backgroundColor: 'var(--color-white-base)',
            cursor: 'pointer',
            padding: '0.1px 0',
          },
          '&.applePayContainer-disabled': {
            '& .merchant-checkout__payment-method': {
              backgroundColor: 'var(--color-black-base)',
              pointerEvents: 'none',
            },
          },
        },
      },
      atbNotifyMeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
          minWidth: '50%',
          width: 'unset',
          flex: 1,
        },
      },
      NotifyMeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.atb-notify-wrapper': {
            borderTopLeftRadius: '0 !important',
            borderBottomLeftRadius: '0 !important',
          },
          '.notify-me': {
            height: '56px',
            mt: '0',
          },
        },
      },
    }),
  },
}
