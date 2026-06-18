export default {
  parts: ['lowerMainContainer', 'productHeaderTitle', 'badgesListContainer'],
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
                ...theme.typography['text-body1-m'],
                height: '42px !important',
              },
            },
            '& .atb-wrapper': {
              ...theme.typography['text-body1-m'],
              height: '42px',
              '& .atb-button-animation, & .chakra-button': {
                height: '42px',
              },
              '& .add-to-cart': {
                ...theme.typography['text-body1-m'],
                p: 'var(--spacing-1) var(--spacing-4) var(--spacing-2)',
                textTransform: 'none',
              },
            },
          },
          '& .atb-notify-wrapper': {
            '& button.notify-me': {
              ...theme.typography['text-body1-m'],
              textTransform: 'none',
              p: 'var(--spacing-4)',
              height: '42px',
            },
            '& .notify-me-button-icon': {
              marginTop: 'var(--spacing-1)',
            },
          },
          '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
            '& .adyen-checkout__applepay__button': {
              margin: 0,
            },
            '& button.buy-now-button': {
              ...theme.typography['text-body1-m'],
              height: '42px',
            },
          },
        },
        '& .findInStoreWrapper, & .memberWrapperExclusive': {
          minWidth: '50%',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          '& button': {
            ...theme.typography['text-body1-m'],
            padding: 'var(--spacing-4)',
            transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          },
        },
        '& .fisButtonWrapper button': {
          ...theme.typography['text-body1-m'],
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
          ...theme.typography['text-body1-l'],
          borderStyle: 'none solid',
          height: '56px',
        },
        '& .fisButtonWrapper, & .memberWrapperExclusive': {
          margin: 0,
          height: '56px',
          '& button': {
            ...theme.typography['text-body1-l'],
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
            ...theme.typography['text-body1-l'],
            height: '56px',
            marginTop: 0,
          },
          '& .atb-wrapper': {
            height: '56px',
            '& button.add-to-cart': {
              ...theme.typography['text-body1-l'],
              p: 'var(--spacing-4)',
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
          '& button.notify-me': {
            ...theme.typography['text-body1-l'],
            textTransform: 'none',
            p: 'var(--spacing-4)',
          },
          '& .notify-me-button-icon': {
            marginTop: 'var(--spacing-1)',
          },
        },
        '& .chakra-select__wrapper': {
          height: '56px',
          '& select': {
            pt: 'var(--spacing-2)',
            height: '56px',
          },
        },
      },
    },
    tabList: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: '58px',
      },
    },
    productHeaderTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-xs'],
        lineHeight: '19.2px',
      },
    },
    variationControlsWrapper: {
      marginTop: 'var(--spacing-4)',
    },
    ministageContainer: {
      justifyContent: 'flex-start',
    },
    badgesListContainer: {
      '&:not(:empty)': {
        marginBottom: 'var(--spacing-2)',
      },
    },
  }),
}
