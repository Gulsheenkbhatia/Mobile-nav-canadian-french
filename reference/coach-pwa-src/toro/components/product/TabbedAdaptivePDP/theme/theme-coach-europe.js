export default {
  part: ['tab', 'lowerMainContainer', 'productHeaderTitle'],
  baseStyle: ({ theme }) => ({
    contentWrapper: {
      mt: 'var(--spacing-4)',
    },
    lowerMainContainer: {
      mt: 'var(--spacing-3)',
      '& .reviews__heading-wrapper': {
        marginRight: 'var(--spacing-6)',
      },
    },
    atbContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .addToBagCTAWrapper': {
          height: '42px',
          '& .atb-ctas-wrapper': {
            height: '42px',
            border: 'none',
            '& .chakra-select__wrapper': {
              height: '42px',
              '& .chakra-select': {
                ...theme.typography['text-cta2-s'],
                height: '42px !important',
                pt: 'var(--spacing-4)',
              },
            },
            '& .atb-wrapper': {
              ...theme.typography['text-cta2-s'],
              height: '42px',
              '& .atb-button-animation, & .chakra-button': {
                height: '42px',
              },
              '& .add-to-cart': {
                ...theme.typography['text-cta2-s'],
                padding: 'var(--spacing-4) var(--spacing-1) var(--spacing-3)',
              },
            },
            '& .atb-notify-wrapper': {
              '& button.notify-me': {
                height: '42px',
              },
              '& .notify-me-button-icon': {
                mb: 'var(--spacing-1)',
              },
            },
          },
        },
        '& .findInStoreWrapper, & .memberWrapperExclusive': {
          minWidth: '50%',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          '& button': {
            ...theme.typography['text-cta2-s'],
            padding: 'var(--spacing-4)',
            transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          },
        },
        '& .fisButtonWrapper button': {
          ...theme.typography['text-cta2-s'],
          borderStyle: 'none',
          borderRight: '1px solid var(--color-inactive)',
        },
        '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
          '& button.buy-now-button': {
            height: '42px',
            marginTop: 0,
            padding: 'var(--spacing-4) var(--spacing-1) var(--spacing-3)',
          },
        },
      },
    },
    atbContainerParallax: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .addToBagCTAWrapper': {
          height: '56px',
        },
        '& .findInStoreWrapper': {
          height: '56px',
        },
        '& .fisButtonWrapper button': {
          ...theme.typography['text-cta2-s'],
          borderStyle: 'none solid',
          height: '56px',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          height: '56px',
          '& button': {
            ...theme.typography['text-cta2-s'],
            padding: 'var(--spacing-4)',
            height: '56px',
            transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          },
        },

        '& .atb-ctas-wrapper, & .memberExclusiveWrapper': {
          borderRadius: 'var(--border-radius-full)',
          overflow: 'hidden',
        },

        '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
          height: '56px',

          '& .atb-button-animation': {
            height: '56px',
          },
          '& button.buy-now-button': {
            ...theme.typography['text-cta2-s'],
            height: '56px',
            marginTop: 0,
            paddingBottom: 'var(--spacing-3)',
          },
          '& .atb-wrapper': {
            height: '56px',
            '& button.add-to-cart': {
              ...theme.typography['text-cta2-s'],
              height: '56px',
            },
          },
          '& button.notify-me': {
            height: '56px',
            borderColor: 'var(--color-inactive)',
            borderStyle: 'none solid',
          },
        },
        '& .atb-notify-wrapper': {
          borderRadius: 0,
          '& .notify-me-button-icon': {
            mb: 'var(--spacing-1)',
          },
        },
        '& .chakra-select__wrapper': {
          height: '56px',
          '& select': {
            height: '56px',
          },
        },
      },
    },
    productHeaderTitle: {
      ...theme.typography['text-cta3-m'],
      lineHeight: '1.1',
    },
    variationControlsWrapper: {
      marginTop: 'var(--spacing-4)',
    },
    ministageContainer: {
      justifyContent: 'flex-start',
    },
    controlsContainer: {
      '& .product-variation-message-error-container:empty': {
        m: 0,
      },
    },
  }),
  variants: {
    pdpV42: ({ theme }) => ({
      contentWrapper: {
        mt: 0,
      },
      variationControlsWrapper: {
        marginTop: 0,
      },
      atbContainer: {
        '& .atb-button-animation': {
          height: '56px',
        },
        '& button.notify-me': {
          mt: 0,
        },
        '& .notify-me-button-icon': {
          mb: 'var(--spacing-1)',
        },
        '& .addToBagCTAWrapper': {
          height: '54px !important',
          '& .atb-ctas-wrapper': {
            height: '54px !important',
            border: '1px solid var(--color-neutral-inactive) !important',
            '& .atb-wrapper': {
              height: '54px !important',
              '& .atb-button-animation, & .chakra-button': {
                height: '54px !important',
              },
            },
          },
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .addToBagCTAWrapper': {
            '& .atb-ctas-wrapper': {
              '& .chakra-select__wrapper': {
                height: '54px',
                '& .chakra-select': {
                  height: '54px !important',
                },
              },
            },
          },
        },
      },
      headerPriceReviewContainer: {
        '& .pdp-price-badge-container': {
          '&:has(.old-price) .active-price': {
            bottom: 0,
          },
        },
      },
    }),
  },
}
