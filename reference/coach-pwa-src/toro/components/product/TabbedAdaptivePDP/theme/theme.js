import {
  IPHONE_PRO_MAX_SCREEN_WIDTH,
  IPHONE_PRO_SCREEN_WIDTH,
  V41_UPL_SLOT_MIN_HEIGHT,
  V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES,
} from 'toro/constants/adaptiveExperience'

export default {
  parts: [
    'productHeaderTitle',
    'productHeaderTitleTruncated',
    'contentWrapper',
    'ministageWrapper',
    'atbContainer',
    'atbContainerParallax',
    'ministageWrapperParallax',
    'heroContainerParallax',
    'badgesListContainer',
    'ministageContainer',
    'headerPriceReviewContainer',
    'headerReviewContainer',
    'heroContainer',
    'ministageContainerParallax',
    'variationControlsWrapper',
    'productSkuContainer',
    'customizeCtaWrapper',
    'productDetailsTitle',
  ],
  baseStyle: ({ theme }) => ({
    productBackground: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: '-1',
      '&.tabbed-adaptive-background': {
        opacity: 0,
        animation: 'fadeIn 1s ease-in forwards',
      },
      '&.hidden-tabbed-adaptive-background': {
        backgroundColor: '#f0f0f0',
        opacity: 1,
        animation: 'fadeIn 1s ease-in forwards',
      },
    },
    lowerMainContainer: {
      backgroundColor: '#f0f0f0',
      '& .klarna-container': {
        backgroundColor: 'transparent !important',
      },
      '& #breadcrumb-container': {
        p: 'var(--spacing-6) var(--spacing-3)',
        m: 0,
      },
      '& #closerlook-section': {
        marginTop: '32px',
        '&:not(:has(~ .occasion-module))': {
          paddingBottom: '35px',
        },
        marginBottom: 0,
        paddingBottom: '22px',
      },
      '& .occasion-module': {
        marginBottom: 0,
        padding: '0 0 28px var(--spacing-3)',
      },
      '& #recommendations-section-ymal': {
        '& .certona_wrapper': {
          paddingBottom: '35px',
          '& .certonaLoadMore': {
            mb: 'var(--spacing-4)',
          },
        },
      },
      '& #recommendations-section': {
        '& .certona_wrapper': {
          paddingTop: '30px',
          paddingBottom: 'var(--spacing-8)',
        },
      },
      '& .content-divider': {
        margin: '0 auto',
      },
      '& #just-for-you': {
        '& > div': {
          minHeight: 0,
        },
        '& .pdp-ugc-container': {
          paddingBottom: '40px',
        },
        '& #social-section:not(:empty)': {
          paddingBottom: '11px',
          paddingTop: '2px',
        },
      },
    },
    productDetailsTitle: {
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-26)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    contentAreaContainer: {
      '.content-divider::before': {
        display: 'none',
      },
      '& .custom-content-area-container': {
        pt: 'var(--spacing-8)',
        minHeight: 'auto !important', // need to rewrite inline style
      },
      '& .content-areaOne': {
        pt: '0 !important',
      },
      '& .content-areaTwo': {
        pt: '0 !important',
      },
      '& .content-areaThree': {
        pt: '0 !important',
      },
    },
    tabPanel: {
      p: 0,
      '& #product-info': {
        p: '0 var(--spacing-3)',
        '& .product-properties': {
          p: 0,
        },
        '& .tangiblee-button-wrapper': {
          paddingTop: 'var(--spacing-6)',
        },
      },
      '& #recommendations-section': {
        p: '0',
        '& .certona_wrapper': {
          pt: '0',
        },
      },
      '& .content-divider:before': {
        height: 0,
      },
    },
    heroContainer: {
      position: 'sticky',
      top: 0,
      minWidth: 0,
      ml: '-mar',
      maxWidth: 'calc(100vw - var(--chakra-space-mar))', // Accounts for the ml above
    },
    heroContainerParallax: {
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: '-12px',
        bottom: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'black',
        opacity: '0.5',
      },
    },
    contentWrapper: {
      zIndex: 20,
      position: 'relative',
      maxWidth: '100vw',
      mx: '-mar',
      '& .rotating-banner': {
        marginTop: '18px',
      },
      '& .horizontal-rotating-banner': {
        marginTop: '18px',
        '& .rotating-banner': {
          m: 0,
        },
      },
    },
    ministageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minHeight: 'calc(100svh - 125vw - 46px)',
      transition:
        'min-height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98), padding 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
      position: 'sticky',
      top: 0,
    },
    ministageWrapperParallax: {
      minHeight: '0',
      position: 'static',
      top: 'unset',
    },
    ministageContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexGrow: 1,
      pb: 'var(--spacing-3)',
      transition: 'padding 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
    },
    ministageContainerParallax: {
      pt: '23px',
    },
    headerContainer: {
      marginTop: 0,
      width: '100%',
    },
    productHeaderTitle: {
      ...theme.typography['text-body2-l'],
      margin: '0 auto',
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-14)',
      fontWeight: 700,
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-120)',
      color: 'var(--color-black-base)',
      fontStyle: 'normal',
      width: '60vw',
      textAlign: 'center',
    },
    productHeaderTitleTruncated: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    badgesListContainer: {
      justifyContent: 'center',
      '.custom-badge:first-of-type': {
        padding: '0 !important',
      },
      label: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12) !important',
        backgroundColor: 'transparent !important',
        color: 'var(--color-black-base) !important',
      },
      '.custom-badge-content p': {
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-140)',
      },
      '&:not(:empty)': {
        marginBottom: '4px',
      },
    },
    atbContainer: {
      '@media (min-height: 668px)': {
        position: 'sticky',
      },
      position: 'sticky',
      width: '100%',
      bottom: 0,
      zIndex: 16,
      transition: 'padding 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
      '& .addToBagCTAWrapper': {
        marginBottom: 0,
        transition: 'margin 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
      },
      '& .chakra-select__wrapper': {
        transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
        '& select': {
          transition:
            'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98), min-height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
        },
      },
      '& .atb-button-animation, & button.buy-now-button, & button.buy-now-button, & .atb-wrapper, & .adyen-checkout__applepay__button':
        {
          transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          '& button.add-to-cart': {
            transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          },
        },
      '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
        borderRadius: 'none',
        transition: 'border-radius 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
        '& .chakra-select__wrapper': {
          height: '40px',
          '& select': {
            height: '40px !important',
            minHeight: '0',
            paddingTop: '10px',
          },
        },
        '& .atb-button-animation': {
          height: '40px',
        },
        '& button.buy-now-button': {
          height: '40px',
          marginTop: 0,
        },
        '& .atb-wrapper': {
          height: '40px',
          '& button.add-to-cart': {
            height: '40px',
          },
        },
        '& button.notify-me': {
          height: '40px',
        },
        '& .adyen-checkout__applepay__button': {
          height: '40px',
          margin: 0,
          '-webkit-appearance': '-apple-pay-button',
          '-apple-pay-button-style': 'white',
        },
      },
    },
    atbContainerParallax: {
      px: 'var(--spacing-3)',
      '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
        borderRadius: '800px',
        overflow: 'hidden',
        flexWrap: 'nowrap',
      },
      '& .chakra-select__wrapper': {
        height: '55px',
        '& select': {
          borderRightColor: 'var(--border-color-neutral-base)',
          paddingLeft: 'var(--spacing-4)',
        },
      },
      '& button.buy-now-button': {
        ...theme.typography['text-cta2-s'],
      },
      '& .atb-wrapper': {
        '& button.add-to-cart': {
          ...theme.typography['text-cta2-s'],
        },
      },
      '& .adyen-checkout__applepay__button': {
        '-webkit-appearance': '-applepay-button',
        '-apple-pay-button-style': 'white',
      },
    },
    variationControlsWrapper: {
      width: '100vw',
      padding: '0 var(--spacing-3)',
    },
    envImpactCorousel: {
      padding: 'var(--spacing-6) var(--spacing-3) 0 var(--spacing-3)',
    },
    tabList: {
      w: '100%',
      left: 0,
      zIndex: 10,
      top: 'unset',
      boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
      margin: '0 var(--spacing-3)',
      padding: '6px',
      background: 'var(--color-white-base)',
      borderRadius: 'var(--spacing-3)',
      width: 'unset',
      border: '0',
    },
    tab: {
      color: 'var(--color-black-base)',
      pt: '11px', // missing in the design token
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-l)',
      border: 0,
      background: 'var(--color-white-base)',
      padding: 'var(--spacing-3)',
      '&[aria-selected="true"],&.active': {
        color: 'var(--color-white-base)',
        borderRadius: 'var(--spacing-2)',
        background: 'var(--color-neutral-dark)',
      },
    },
    titleWithIcon: {
      display: 'inline-flex',
      gap: 'var(--spacing-1)',
      alignItems: 'center',
    },
    viewMoreButton: {
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
      fontSize: 'var(--text-10)',
      lineHeight: 1,
      letterSpacing: 'var(--letter-spacing-xs)',
      textTransform: 'capitalize',
      backgroundColor: 'var(--color-black-base)',
      color: 'var(--color-white-base)',
      borderRadius: '130px',
      height: '28px',
      paddingLeft: '14px',
      paddingRight: '7px',
      marginTop: 'var(--spacing-6)',
      width: 'fit-content',
      alignSelf: 'center',
      svg: {
        path: { fill: 'var(--color-white-base)' },
      },
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-black-base)',
      },
    },
    gradient: {
      marginTop: '-40px',
      height: '40px',
      zIndex: 1,
      background: 'linear-gradient(to bottom, transparent 3%, #f0f0f0 100%)',
      w: '100vw',
    },
    controlsContainer: {
      width: '100%',
      pb: 'var(--spacing-3)',
      '& > :first-child': {
        mt: 0,
      },
      '& .product-variation-message-error-container': {
        px: 'var(--spacing-4)',
        mt: '18px',
      },
      '& .product-info-message-alert': {
        mb: 0,
      },
    },
    productSkuContainer: {
      display: 'flex',
      marginTop: 'var(--spacing-2)',
      marginBottom: 'var(--spacing-2)',
    },
    productSku: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-neutral-medium)',
      fontWeight: 300,
    },
    reviewSection: {
      '&:has(>div:empty)': {
        minHeight: '100vh',
      },
    },
  }),
  variants: {
    pdpV41: () => ({
      contentWrapper: {
        borderRadius: '18px 18px 0px 0px',
        '& .rotating-banner': {
          marginTop: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-4)',
        },
      },
      ministageContainer: {
        pt: 'var(--spacing-3)',
      },
      ministageWrapper: {
        '&.ministage-w-atb': {
          [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
            '& .pdp-price-info-wrapper': {
              '& .pdp-active-price': {
                '& p': {
                  fontSize: 'var(--text-16)',
                },
                minHeight: 'unset',
              },
              '& .pdp-price-discount-range-wrapper p': {
                fontSize: 'var(--text-14)',
              },
            },
            '& .pdp-comparable-price': {
              '& p': {
                fontSize: 'var(--text-12)',
                color: 'var(--color-neutral-medium)',
              },
            },
            '& .swatchWrapper': {
              w: '54px',
              h: '54px',
              '&.disabled-color::after': {
                width: '54px',
                height: '54px',
              },
              '&.activeColorSwatch img': {
                h: '64px',
              },
              '& > div': {
                height: '54px',
                img: {
                  h: '64px',
                },
              },
            },
            '&:not(:has(.pdp-comparable-price))': {
              '& .tabbed-pdp-product-title': {
                display: '-webkit-box',
                whiteSpace: 'normal',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              },
            },
            '& .pdpCallloutMessage': {
              mt: '10px',
            },
          },
          [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
            '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
              '& .chakra-select__wrapper': {
                height: '54px !important',
                '& select': {
                  height: '54px !important',
                },
              },
            },
            '& .atb-button-animation': {
              height: '54px !important',
            },
            '& button.buy-now-button': {
              height: '54px !important',
            },
            '& .atb-wrapper': {
              height: '54px !important',
              '& button.add-to-cart': {
                height: '54px !important',
              },
            },
            '& button.notify-me': {
              height: '54px !important',
            },
            '& .adyen-checkout__applepay__button': {
              height: '54px !important',
            },
            '& .variationControlsWrapper': {
              mt: '14px',
              '&:empty': {
                mt: 0,
              },
            },
          },
          //hide empty controls wrapper on PDP v4.1 ministage in order to center content properly
          '& .controlsWrapper': {
            display: 'none',
          },
        },
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
          minHeight: `calc(100svh - 125vw + ${V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES}px)`,
        },
        minHeight: `calc(100svh - 125vw + ${V41_UPL_SLOT_MIN_HEIGHT}px)`,
        borderRadius: '18px 18px 0px 0px',
        backgroundColor: 'var(--color-white-base)',
        '& .pdp-comparable-price': {
          '& p': {
            fontSize: 'var(--text-12)',
          },
        },
        '& .pdp-price-info-wrapper': {
          '& .pdp-active-price': {
            '& p': {
              fontSize: 'var(--text-12)',
            },
            minHeight: 'unset',
          },
          '& .pdp-price-discount-range-wrapper p': {
            fontSize: 'var(--text-12)',
          },
        },
        '& .pdp-price-badge-container': {
          mt: 'var(--spacing-1)',
        },
        '& .variationControlsWrapper': {
          mt: '6px',
          '&:empty': {
            mt: 0,
          },
        },
      },
      ministageWrapperParallax: {
        minHeight: `calc(100svh - 125vw + ${V41_UPL_SLOT_MIN_HEIGHT}px)`,
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
          minHeight: `calc(100svh - 125vw + ${V41_UPL_SLOT_MIN_HEIGHT_LARGE_DEVICES}px)`,
        },
        backgroundColor: '#f0f0f0',
        '& .pdp-comparable-price': {
          '& p': {
            fontSize: 'var(--text-12)',
          },
        },
        '& .pdp-price-info-wrapper': {
          '& .pdp-active-price': {
            '& p': {
              fontSize: 'var(--text-14)',
            },
            minHeight: 'unset',
          },
          '& .pdp-price-discount-range-wrapper p': {
            fontSize: 'var(--text-12)',
          },
        },
        '& .pdp-price-badge-container': {
          mt: 'var(--spacing-2)',
        },
        '& .variationControlsWrapper': {
          mt: '20px',
          mb: 'var(--spacing-1)',
        },
      },
      productHeaderTitleTruncated: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontWeight: 'normal',
        fontSize: 'var(--text-12)',
        lineHeight: '120%',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
          fontSize: 'var(--text-16)',
          width: '85vw',
          mt: 0,
          letterSpacing: 'var(--letter-spacing-s)',
          position: 'relative',
          bottom: '3px',
        },
        [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
          width: '80vw',
        },
      },
      productHeaderTitle: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        lineHeight: '120%',
        letterSpacing: 'var(--letter-spacing-xs)',
        mt: 'var(--spacing-2)',
      },
      atbContainer: {
        '& .atb-ctas-wrapper': {
          '& button, & select': {
            fontFamily: 'var(--font-face1-extended-normal) !important',
            fontSize: 'var(--text-14) !important',
          },
          borderRadius: '800px',
          overflow: 'hidden',
          margin: '0 var(--spacing-2) 10px var(--spacing-2)',
          flexWrap: 'nowrap',
        },
      },
      atbContainerParallax: {
        '& .atb-ctas-wrapper': {
          borderRadius: null,
          overflow: null,
          margin: null,
        },
      },
      heroContainerParallax: {
        '& .customPaginationBottom': {
          h: '100%',
          '& > div': {
            h: '100%',
          },
        },
      },
    }),
    pdpV42: () => ({
      contentWrapper: {
        borderRadius: '18px 18px 0px 0px',
        '& .rotating-banner': {
          m: 'var(--spacing-2) var(--spacing-4)',
          borderRadius: '800px',
          w: '92%',
        },
        '& .findInStoreWrapper > div': {
          borderRadius: '800px',
        },
        '& .horizontal-rotating-banner': {
          padding: '0 var(--spacing-3)',
          '& .rotating-banner': {
            m: 'var(--spacing-2) var(--spacing-1)',
          },
        },
      },
      ministageWrapper: {
        '&.ministage-w-atb': {
          '& .pdp-price-info-wrapper .custom-badge': {
            display: 'none',
          },
        },
        p: 'var(--spacing-4) var(--spacing-4) 19px',
        minHeight: 'calc(100svh - 115vw + 45px)',
        backgroundColor: 'var(--color-white-base)',
        borderRadius: '18px 18px 0px 0px',
        boxShadow: '0px -4px 44px 0px rgba(0, 0, 0, 0.08)',
        '& .controlsWrapper:empty': {
          display: 'none',
        },
        '& .scroll-parent': {
          justifyContent: 'flex-start',
          '& .color-variants>div:first-child': {
            ml: 0,
          },
        },
      },
      ministageWrapperParallax: {
        backgroundColor: 'var(--color-neutral-light-1)',
        p: 'var(--spacing-6) var(--spacing-4) var(--spacing-4)',
        '& div:has(.addToBagCTAWrapper)': {
          p: 0,
        },
        '& .controlsWrapper:empty': {
          display: 'none',
        },
        '& .controlsWrapper': {
          '& .product-variation-label': {
            pr: 0,
            '& p:first-child': {
              pl: 0,
            },
          },
          '& .controls-btn-wrapper div:first-child': {
            ml: 0,
          },
          '& .size-guide-container': {
            pl: 0,
          },
        },
      },
      ministageContainerParallax: {
        p: 0,
        m: 0,
        '&:has(.pdp-v4-2-upl-promo-container)': {
          mb: 0,
        },
        '&:not(:has(.pdp-v4-2-upl-promo-container))': {
          mb: 'var(--spacing-6)',
          '& .product-title-price-reviews-container': {
            mb: '3px',
          },
        },
        '& .pdp-price-badge-container': {
          '& .pdp-price-info-wrapper:has(.custom-badge)': {
            flexWrap: 'wrap',
          },
          '& div:has(div.ipx1-promo-wrapper-parallax)': {
            w: '100%',
          },
          '& .ipx1-promo-wrapper-parallax': {
            mt: 'var(--spacing-2)',
            display: 'flex',
            justifyContent: 'center',
            '& .callout-message-container': {
              mb: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
        },
        '& button[data-qa="pdp_pagination_arrow_left"]': {
          backgroundColor: 'var(--color-neutral-light-1)',
          h: '56px',
        },
        '& button[data-qa="pdp_pagination_arrow_right"]': {
          backgroundColor: 'var(--color-neutral-light-1)',
          h: '56px',
        },
      },
      ministageContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mb: 'var(--spacing-6)',
        pb: 0,
        '&:has(.pdp-v4-2-upl-promo-container)': {
          mb: '12px',
        },
        '&:not(:has(.pdp-v4-2-upl-promo-container))': {
          '& .product-title-price-reviews-container': {
            mb: '20px',
          },
        },
        '& button[data-qa="pdp_pagination_arrow_left"]': {
          backgroundColor: 'var(--color-white-base)',
          h: '56px',
        },
        '& button[data-qa="pdp_pagination_arrow_right"]': {
          backgroundColor: 'var(--color-white-base)',
          h: '56px',
        },
      },
      headerReviewContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        w: '100%',
        '& .ratings-container': {
          mt: '1px',
          flexDirection: 'row-reverse',
          '& span': {
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-14)',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '100%',
            letterSpacing: 'var(--letter-spacing-xs)',
            mr: '6px',
            mt: '4px',
          },
          '& .star-icon-wrapper': {
            mb: '2px',
          },
        },
      },
      headerPriceReviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        w: '100%',
        '& .pdp-price-badge-container': {
          alignItems: 'flex-start',
          mt: 0,
          '&:has(.old-price) .active-price': {
            color: 'var(--color-success-primary)',
            position: 'relative',
            bottom: '2px',
          },
          '& .active-price': {
            color: 'var(--color-primary, #000003)',
            fontFamily: 'var(--font-face1-extended-bold)',
            fontSize: 'var(--text-14)',
            letterSpacing: 'var(--letter-spacing-s)',
            lineHeight: '100%',
          },
          '& .old-price': {
            color: 'var(--Neutrals-color-neutral-1, #6D6D6D)',
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-14)',
            letterSpacing: 'var(--letter-spacing-s)',
            textDecoration: 'strikethrough',
            mt: '1px',
          },
          '& .discount-text': {
            color: 'var(--Neutrals-color-neutral-1, #6D6D6D)',
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-14)',
            letterSpacing: 'var(--letter-spacing-s)',
          },
          '&:has(div.pdp-comparable-price)': {
            flexDirection: 'column',
            justifyContent: 'left',
            '& .pdp-comparable-price': {
              m: '3px var(--spacing-1) 1px',
            },
            '& .comparable-price-container p': {
              fontSize: 'var(--text-10)',
            },
            '& .discount-text': {
              color: 'var(--color-success-primary, #057550)',
              mt: '5px',
            },
          },
        },
      },
      badgesListContainer: {
        justifyContent: 'flex-start',
      },
      variationControlsWrapper: {
        p: '0 var(--spacing-4)',
        '& .scrollableContent': {
          maxWidth: '100%',
          mr: 0,
          '& span': {
            mr: 'var(--spacing-1)',
          },
          '& a': {
            mr: 0,
          },
          '& .swatchWrapper': {
            borderRadius: 'var(--border-radius-m)',
            overflow: 'hidden',
            w: '54px',
            h: '54px',
            '&.disabled-color::after': {
              width: '54px',
              height: '54px',
            },
            '& > div': {
              height: '54px',
            },
          },
          '& .activeColorSwatch': {
            border: '1.125px solid var(--Neutrals-color-neutral, #949494)',
            borderRadius: '9px',
          },
        },
        '& button[disabled][data-qa="pdp_pagination_arrow_left"]': {
          display: 'none',
        },
        '& button[disabled][data-qa="pdp_pagination_arrow_right"]': {
          display: 'none',
        },
        '& button[data-qa="pdp_pagination_arrow_left"]': {
          position: 'absolute',
          bottom: '0',
        },
        '& button[data-qa="pdp_pagination_arrow_right"]': {
          position: 'absolute',
          bottom: '0',
        },
      },
      atbContainer: {
        '& .atb-button-animation': {
          height: '54px !important',
        },
        '& button.buy-now-button': {
          height: '54px !important',
        },
        '& .atb-wrapper': {
          height: '54px !important',
          '& button.add-to-cart': {
            height: '54px !important',
          },
        },
        '& button.notify-me': {
          height: '54px !important',
        },
        '& .adyen-checkout__applepay__button': {
          height: '40px !important',
          margin: '8px 0px !important',
        },
        '& .atb-ctas-wrapper': {
          '& button:not(.adyen-checkout__applepay__button), & select': {
            fontFamily: 'var(--font-face1-extended-normal) !important',
            fontSize: 'var(--text-14) !important',
            height: '54px !important',
          },
          '& .chakra-select__wrapper': {
            height: '54px',
            '& select': {
              height: '54px !important',
            },
          },
          borderRadius: '800px',
          overflow: 'hidden',
          margin: 0,
          flexWrap: 'nowrap',
          h: '54px',
        },
      },
      productHeaderTitle: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        letterSpacing: 'var(--letter-spacing-s)',
        lineHeight: 'var(--line-height-120)',
        color: 'var(--color-black-base)',
        fontStyle: 'normal',
        width: '95%',
        m: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        whiteSpace: 'normal',
        pb: '2px',
        mb: '4px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      },
      productSkuContainer: {
        display: 'none',
      },
      customizeCtaWrapper: {
        alignSelf: 'start',
      },
    }),
  },
}
