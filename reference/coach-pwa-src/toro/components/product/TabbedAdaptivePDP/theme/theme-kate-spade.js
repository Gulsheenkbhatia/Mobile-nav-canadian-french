export default {
  baseStyle: ({ theme }) => ({
    lowerMainContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-product-image-bg)',
      },
      '& #recommendations-section-ymal': {
        '& .certona_wrapper': {
          paddingBottom: 'var(--spacing-8)',
        },
      },
    },
    ministageContainerParallax: {
      paddingTop: 'var(--spacing-6)',
    },
    productHeaderTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-xs'],
        fontWeight: 400,
        color: 'var(--color-black-base)',
      },
    },
    productDetailsTitle: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-28)',
      lineHeight: '1.07',
      letterSpacing: 0,
      mb: '28px',
    },
    badgesListContainer: {
      '& div.custom-badge > div': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          textTransform: 'none',
        },
      },
      '&:not(:empty)': {
        marginBottom: 0,
      },
    },
    contentWrapper: {
      backgroundColor: 'var(--color-product-image-bg)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .rotating-banner': {
          backgroundColor: 'var(--color-white-base)',
          marginLeft: 'var(--spacing-3)',
          marginRight: 'var(--spacing-3)',
          marginTop: '10px',
          marginBottom: 'var(--spacing-4)',
          borderRadius: 'var(--border-radius-s)',
          width: 'auto',
        },
        '& .horizontal-rotating-banner': {
          padding: '0 var(--spacing-3)',
          marginTop: '10px',
          '& .rotating-banner': {
            margin: 0,
            width: '100%',
          },
        },
      },
      '& .horizontal-rotating-banner': {
        padding: '0 var(--spacing-3)',
        marginTop: '10px',
        '& .rotating-banner': {
          margin: 0,
          width: '100%',
        },
      },
    },
    atbContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .atb-ctas-wrapper': {
          flexWrap: 'nowrap',
        },
        '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
          '& .adyen-checkout__applepay__button': {
            height: '40px',
            margin: '8px 0px',
          },
          '& .applePayContainer-disabled': {
            '& .merchant-checkout__payment-method': {
              backgroundColor: 'var(--color-white-base)',
              pointerEvents: 'none',
            },
          },
          '& .chakra-select__wrapper': {
            height: '56px',
            '& select': {
              height: '56px !important',
              paddingTop: 'var(--spacing-3)',
            },
          },
          '& .atb-button-animation': {
            height: '56px',
          },
          '& button.buy-now-button': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            height: '56px',
            paddingTop: 'var(--spacing-4)',
          },
          '& .atb-wrapper': {
            height: '56px',
            '& button.add-to-cart': {
              ...theme.typography['text-body1-l'],
              textTransform: 'none',
              height: '56px',
              paddingTop: 'var(--spacing-3)',
            },
            '& button.initial-add-to-bag': {
              ...theme.typography['text-body1-l'],
              textTransform: 'none',
            },
            '& .text-progress': {
              ...theme.typography['text-body1-s'],
              textTransform: 'none',
            },
          },
          '& button.notify-me': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            height: '56px',
            paddingTop: 'var(--spacing-4)',
          },
        },
      },
    },
    atbContainerParallax: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .atb-ctas-wrapper': {
          flexWrap: 'nowrap',
        },
        '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
          borderRadius: '800px',
          '& .chakra-select__wrapper': {
            height: '56px',
            '& select': {
              borderRightColor: 'var(--border-color-neutral-base)',
              paddingTop: 'var(--spacing-3)',
            },
          },

          '& button.buy-now-button': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            paddingTop: 'var(--spacing-4)',
          },

          '& .atb-wrapper': {
            '& button.add-to-cart, & button.initial-add-to-bag': {
              ...theme.typography['text-body1-l'],
              textTransform: 'none',
              paddingTop: 'var(--spacing-3)',
            },
            '& .text-progress': {
              ...theme.typography['text-body1-s'],
              textTransform: 'none',
            },
          },
          '& button.notify-me': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            paddingTop: 'var(--spacing-4)',
          },
        },
        '#pdp-sticky-container': {
          '& .chakra-select__wrapper': {
            height: '56px',
            '& select': {
              padding: 'var(--spacing-3) var(--spacing-4) 10px var(--spacing-3)',
              borderRightColor: 'var(--color-white-20)',
            },
          },
          '& button.buy-now-button': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            height: '56px',
            paddingTop: 'var(--spacing-4)',
          },

          '.atb-wrapper': {
            height: '56px',
            '& button.add-to-cart, & button.initial-add-to-bag': {
              ...theme.typography['text-body1-l'],
              textTransform: 'none',
              paddingTop: 'var(--spacing-3)',
            },
            '& .text-progress': {
              ...theme.typography['text-body1-s'],
              textTransform: 'none',
            },
          },
          '& button.notify-me': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            paddingTop: 'var(--spacing-4)',
          },
        },
      },
    },
    tabs: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingTop: 'var(--spacing-3)',
      },
    },
    tabList: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderRadius: 'var(--border-radius-l)',
      },
    },
    tab: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-l'],
        '&[aria-selected="true"],&.active': {
          color: 'var(--color-white-base)',
          borderRadius: 'var(--border-radius-m)',
          background: 'var(--color-black-base)',
        },
      },
    },
    ministageWrapperParallax: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backgroundColor: 'var(--color-product-image-bg)',
        '.truefit-widget': {
          paddingLeft: 'var(--spacing-4)',
        },
      },
    },
    contentAreaContainer: {
      '.content-areaTwo': {
        article: {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            backgroundColor: 'var(--color-product-image-bg)',
          },
        },
      },
    },
    tabPanel: {
      '& #product-info': {
        '& .tangiblee-button-wrapper': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            marginTop: 'var(--spacing-4)',
            paddingBottom: 'var(--spacing-6)',
            borderColor: 'var(--color-neutral-light-2)',
          },
        },
      },
    },
  }),
}
