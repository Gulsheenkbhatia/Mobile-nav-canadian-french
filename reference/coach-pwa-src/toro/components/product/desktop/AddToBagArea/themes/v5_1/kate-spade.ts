import { customAtbCtaBackgroundColorVariable } from 'toro/components/product/desktop/AddToBagArea/AddToBagButton'

const buttonHeight = '64px'

export default {
  parts: [
    'rootContainer',
    'addToBagControlsWrapper',
    'addToBagControls',
    'applePayWrapper',
    'addToBagContainerCustomColor',
  ],
  baseStyle: ({ theme }) => ({
    rootContainer: {
      marginLeft: 0,
      marginY: '18px',
      height: 'auto',
      maxWidth: '100%',
      flexWrap: 'wrap',
      '& .memberWrapperExclusive button': {
        minWidth: '100%',
        minHeight: buttonHeight,
        padding: '20px 40px',
        fontWeight: '500',
      },
      '& .memberWrapperExclusive button span:not(:has(svg))': {
        ...theme.typography['text-body1-l'],
      },
      '&:has(+ .callout-message-container)': {
        marginBottom: '8px',
      },
    },
    addToBagControlsWrapper: {
      width: '100%',
      gap: '6px',
      '& .atb-qty-selector::after': {
        height: '22px',
        top: 'calc(50% - 11px)',
      },
      '& .atb-qty-selector select': {
        ...theme.typography['text-body2-l'],
        width: '19px !important',
        height: buttonHeight,
        paddingLeft: '39px',
        paddingRight: 0,
        backgroundColor: 'var(--neutral-grey-900, #161616)',
      },
      '& .atb-qty-selector .chakra-select__icon-wrapper': {
        left: '20px',
      },
      '& .atb-qty-selector .chakra-select__icon': {
        transform: 'rotate(180deg)',
        '& svg': {
          transform: 'scale(3.1)',
        },
      },
      '& .atb-container:has(.atb-qty-selector):not(:has(.atb-button-animation)) #add-to-cart': {
        paddingLeft: '24px',
        backgroundColor: 'var(--neutral-grey-900, #161616)',
      },
      '& .atb-container:not(:has(.atb-qty-selector)) #add-to-cart:not(:disabled)': {
        backgroundColor: 'var(--color-black-base, #000)',
      },
      '& .atb-container:has(.atb-qty-selector):hover #add-to-cart:not(:disabled), & .atb-container:hover #add-to-cart:not(:disabled)':
        {
          backgroundColor: 'var(--color-green-500, #057550)',
        },
      '& .atb-container-disabled': {
        cursor: 'not-allowed',
      },
      '& #add-to-cart, & .atb-container, & .alter-cta-wrapper': {
        minHeight: buttonHeight,
        '&:has(button:disabled)': {
          backgroundColor: 'transparent',
        },
        '&:has(button.notify-me)': {
          border: '0 none',
        },
      },
      '& .alter-cta-wrapper': {
        borderColor: 'var(--color-neutral-light-2, #e1e1e1)',
      },
      '& #add-to-cart': {
        borderColor: 'transparent',
        padding: '20px 40px',
      },
      '& button': {
        ...theme.typography['text-body1-l'],
        fontWeight: '500',
        border: '0 none',
        '&:disabled': {
          border: '0 none',
          pointerEvents: 'none',
          color: '#6d6d6d',
          backgroundColor: 'var(--color-neutral-light-2, #e1e1e1)',
          cursor: 'default',
        },
      },
      '& .buy-now-button': {
        padding: '20px 40px',
      },
      '& .notify-me': {
        padding: '20px 40px',
        flexDirection: 'row-reverse',
      },
      '& .notify-me-button-icon': {
        marginRight: '6px',
      },
    },
    addToBagContainerCustomColor: {
      '& .atb-qty-selector select': {
        backgroundColor: `var(${customAtbCtaBackgroundColorVariable}) !important`,
      },
      '&:has(.atb-qty-selector):hover #add-to-cart:not(:disabled), &:hover #add-to-cart:not(:disabled)':
        {
          backgroundColor: `var(${customAtbCtaBackgroundColorVariable}) !important`,
        },

      '&.atb-container:has(.atb-qty-selector):not(:has(.atb-button-animation)) #add-to-cart': {
        backgroundColor: `var(${customAtbCtaBackgroundColorVariable})`,
      },

      '&:not(:has(.atb-qty-selector)) #add-to-cart:not(:disabled)': {
        backgroundColor: `var(${customAtbCtaBackgroundColorVariable})`,
      },

      '&:not(.atb-container-disabled)': {
        '&:hover:not(:disabled), &:active': {
          backgroundColor: `var(${customAtbCtaBackgroundColorVariable})`,
          boxShadow:
            // dark green box shadow - needed because of shallow merge of this style
            '0px 137px 38px 0px rgba(13, 84, 37, 0.01), 0px 88px 35px 0px rgba(13, 84, 37, 0.04), 0px 49px 30px 0px rgba(13, 84, 37, 0.15), 0px 22px 22px 0px rgba(13, 84, 37, 0.26), 0px 5px 12px 0px rgba(13, 84, 37, 0.29)',

          '& .chakra-select, & .chakra-button': {
            backgroundColor: `var(${customAtbCtaBackgroundColorVariable})`,
          },
        },
      },
    },
    addToBagControls: {
      minHeight: buttonHeight,
    },
    applePayWrapper: {
      width: '100%',
      '& .adyen-checkout__applepay__button': {
        display: 'flex',
        height: '40px',
        margin: '12px 0px',
        borderRadius: 0,
        border: 'none',
        width: '100%',
        '-webkit-appearance': '-apple-pay-button',
        '-apple-pay-button-style': 'white',
      },
    },
  }),
}
