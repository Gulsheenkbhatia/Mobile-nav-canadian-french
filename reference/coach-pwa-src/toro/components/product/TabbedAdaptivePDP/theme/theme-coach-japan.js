export default {
  parts: ['tabPanel', 'productHeaderTitle'],
  baseStyle: ({ theme }) => ({
    atbContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .addToBagCTAWrapper .chakra-select': {
          lineHeight: 'var(--line-height-150)',
        },
      },
      '& .findInStoreWrapper, & .memberWrapperExclusive': {
        minWidth: '50%',
      },
      '& .atb-notify-wrapper': {
        '& button.notify-me': {
          ...theme.typography['text-body1-s'],
          textTransform: 'none',
          p: 'var(--spacing-4)',
          height: '40px',
        },
      },
      '& .fisButtonWrapper, & .memberWrapperExclusive': {
        margin: 0,
        '& button': {
          padding: 'var(--spacing-4)',
          border: 'none',
          height: '40px',
          transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          ...theme.typography['text-cta1-s'],
          fontWeight: '300',
        },
      },
      '& .fisButtonWrapper button': {
        borderRight: '1px solid var(--color-inactive)',
      },
    },
    atbContainerParallax: {
      '& .atb-ctas-wrapper, & .memberExclusiveWrapper': {
        borderRadius: 'var(--border-radius-full)',
      },
      '& .fisButtonWrapper, & .memberWrapperExclusive': {
        margin: 0,
        height: '56px',
        '& button': {
          padding: 'var(--spacing-4)',
          border: 'none',
          height: '54px',
          transition: 'height 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
          ...theme.typography['text-cta1-s'],
          fontWeight: '300',
        },
      },
      '& .atb-notify-wrapper': {
        borderRadius: 0,
        '& button.notify-me': {
          ...theme.typography['text-body1-s'],
          textTransform: 'none',
          p: 'var(--spacing-4)',
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
    lowerMainContainer: {
      '.rotating-banner .product-info-message-alert, .rotating-banner .callout-message-container': {
        background: 'transparent',
        padding: '0 var(--spacing-3)',
      },
    },
    productHeaderTitle: {
      letterSpacing: 'var(--letter-spacing-m)',
    },
  }),
  variants: {
    pdpV42: () => ({
      productSkuContainer: {
        display: 'flex',
      },
      atbContainer: {
        '& .fisButtonWrapper button': {
          paddingBottom: 'var(--spacing-3)',
        },
        '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
          '& .chakra-select__wrapper': {
            '& select': {
              paddingLeft: 'var(--spacing-4)',
              paddingTop: '14px',
            },
          },
          '& .atb-wrapper': {
            height: '55px',
            '& button.add-to-cart': {
              letterSpacing: 'var(--letter-spacing-xs)',
            },
          },
        },
      },
      atbContainerParallax: {
        '#pdp-sticky-container': {
          '.chakra-select': {
            lineHeight: 'var(--line-height-150)',
          },
          height: '52px',
          '& .fisButtonWrapper button': {
            paddingBottom: 'var(--spacing-3)',
          },
          '& .chakra-select__wrapper': {
            '& select': {
              fontSize: 'var(--text-14)',
              fontFamily: 'var(--font-face1-extended-normal)',
            },
          },
          '& button.notify-me': {
            marginTop: '0px',
          },
        },
        '& .chakra-select__wrapper': {
          height: '56px',
          '& select': {
            paddingTop: '14px',
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
