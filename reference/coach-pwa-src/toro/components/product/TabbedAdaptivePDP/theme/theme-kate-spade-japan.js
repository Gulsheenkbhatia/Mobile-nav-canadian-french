export default {
  parts: [
    'ministageContainer',
    'tab',
    'lowerMainContainer',
    'tabPanel',
    'contentWrapper',
    'atbContainer',
    'atbContainerParallax',
    'productSkuContainer',
    'productHeaderTitle',
    'ministageWrapper',
  ],
  baseStyle: ({ theme }) => ({
    tab: {
      color: 'var(--color-black-base)',
      background: 'var(--color-white-base)',
      '&[aria-selected="true"],&.active': {
        color: 'var(--color-white-base)',
        borderRadius: 'var(--spacing-2)',
        background: 'var(--color-black-base)',
      },
    },
    contentWrapper: {
      mt: 'var(--spacing-4)',
    },
    lowerMainContainer: {
      '& .reviews__heading-wrapper': {
        marginRight: 'var(--spacing-6)',
      },
    },
    atbContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .addToBagCTAWrapper': {
          height: '40px',
          '& .atb-ctas-wrapper': {
            height: '40px',
            border: 'none',
            '& .chakra-select__wrapper': {
              height: '40px',
              '& .chakra-select': {
                ...theme.typography['text-body1-s'],
                height: '40px !important',
              },
            },
            '& .atb-wrapper': {
              ...theme.typography['text-body1-s'],
              height: '40px',
              '& .atb-button-animation, & .chakra-button': {
                height: '40px',
              },
              '& .add-to-cart': {
                ...theme.typography['text-body1-s'],
              },
            },
          },
          '& .atb-notify-wrapper': {
            '& button.notify-me': {
              ...theme.typography['text-body1-s'],
              textTransform: 'none',
              p: 'var(--spacing-4)',
              height: '48px',
            },
          },
        },

        '& .findInStoreWrapper, & .memberWrapperExclusive': {
          minWidth: '50%',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          '& button': {
            ...theme.typography['text-body1-s'],
            padding: 'var(--spacing-4)',
            transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          },
        },

        '& .fisButtonWrapper button': {
          ...theme.typography['text-body1-s'],
          borderStyle: 'none',
          borderRight: '1px solid var(--color-inactive)',
        },
      },
    },
    atbContainerParallax: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .findInStoreWrapper, & .memberWrapperExclusive': {
          minWidth: '50%',
        },
        '& .addToBagCTAWrapper': {
          height: '56px',
        },
        '& .findInStoreWrapper': {
          height: '56px',
        },
        '& .fisButtonWrapper button': {
          ...theme.typography['text-body1-s'],
          borderStyle: 'none solid',
          height: '56px',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          height: '56px',
          '& button': {
            ...theme.typography['text-body1-s'],
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
            ...theme.typography['text-body1-s'],
            height: '56px',
            marginTop: 0,
          },
          '& .atb-wrapper': {
            height: '56px',
            width: 'var(--spacing-6)',
            '& button.add-to-cart': {
              ...theme.typography['text-body1-s'],
              height: '56px',
            },
          },
          '& button.notify-me': {
            ...theme.typography['text-body1-s'],
            p: 'var(--spacing-4)',
            height: '56px',
            borderColor: 'var(--color-inactive)',
            borderStyle: 'none solid',
          },
        },
        '& .atb-notify-wrapper': {
          borderRadius: 0,
        },
        '& .chakra-select__wrapper': {
          height: '56px',
          '& select': {
            height: '56px',
          },
        },
        '#pdp-sticky-container': {
          '& button.notify-me': {
            ...theme.typography['text-body1-s'],
            p: 'var(--spacing-4)',
            textTransform: 'none',
          },
        },
      },
    },
  }),
  variants: {
    pdpV42: ({ theme }) => ({
      productSkuContainer: {
        display: 'flex',
      },
      atbContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .addToBagCTAWrapper': {
            height: '56px',
            '& .atb-ctas-wrapper': {
              border: '1px solid var(--color-neutral-inactive)',
              borderRadius: '800px',
              height: '56px',
              '& .chakra-select__wrapper': {
                height: '56px',
                '& .chakra-select': {
                  height: '56px',
                },
              },
            },
            '& .atb-notify-wrapper': {
              '& button.notify-me': {
                height: '56px',
              },
            },
          },
          '& .atb-wrapper': {
            height: '56px',
            '& .atb-button-animation, & .chakra-button': {
              height: '56px',
            },
          },
        },
        [`@media (max-width: 375px)`]: {
          '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
            '& .atb-wrapper': {
              '& button.add-to-cart': {
                p: 'var(--spacing-3) 0',
              },
            },
          },
          '& .fisButtonWrapper, & .memberWrapperExclusive': {
            '& button': {
              padding: 'var(--spacing-2)',
            },
          },
        },
      },
      atbContainerParallax: {
        [`@media (max-width: 375px)`]: {
          '#pdp-sticky-container': {
            '.atb-wrapper': {
              '& button.add-to-cart, & button.initial-add-to-bag': {
                fontSize: 'var(--text-12)',
              },
            },
          },
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .fisButtonWrapper, & .memberWrapperExclusive': {
            display: 'flex',
            flex: '1 1 50%',
            '& button': {
              [`@media (max-width: 375px)`]: {
                padding: 'var(--spacing-2)',
              },
            },
          },
          '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
            '& .atb-wrapper': {
              '& button.add-to-cart': {
                fontSize: 'var(--text-12) !important',
                height: '56px!important',
                [`@media (max-width: 375px)`]: {
                  p: 'var(--spacing-3) 0',
                },
              },
            },
          },
          '#pdp-sticky-container': {
            height: '52px',
          },
        },
      },
      tabPanel: {
        '& #product-info': {
          p: '0 var(--spacing-6)',
        },
      },
    }),
  },
}
