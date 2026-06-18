const fullButtonHeight = '50px'
const minimizedButtonHeight = '50px'

const buttonContainerCommonStyles = {
  flexGrow: 1,
  flexBasis: 0,
  height: fullButtonHeight,
  textTransform: 'none',
}

export const alterCtaCommonStyles = {
  backgroundColor: 'var(--color-white-base, #fff)',
  height: '100%',
  cursor: 'pointer',
  color: 'var(--color-black-base, #000)!important',
}

export const alterCtaCommonHoverStyles = {
  backgroundColor: 'var(--color-black-base, #000)',
  color: 'var(--color-white-base, #FFF)!important',
  borderColor: 'var(--color-black-base, #000)',
}

export default {
  parts: [
    'rootContainer',
    'addToBagContainer',
    'addToBagBtn',
    'qtySelectorHidden',
    'qtyWrapper',
    'alternateCtaWrapper',
    'buyNowWrapper',
    'buyNowButton',
    'applePayWrapper',
    'membershipButtonArea',
  ],
  baseStyle: ({ theme }) => ({
    rootContainer: {
      height: '100%',
      flexGrow: 1,
      columnGap: 'var(--spacing-2)',
      maxWidth: '310px',
      alignItems: 'center',
      justifyContent: 'flex-end',
      ml: 'auto',

      '&.atb-area-minimized': {
        '& .alter-cta-wrapper, & .atb-container': {
          height: minimizedButtonHeight,
        },
        '& #add-to-cart': {
          paddingLeft: '30px',
        },
        '& .atb-qty-selector': {
          opacity: '0',
          transform: 'scale(0.5) translateY(20px)',
          width: '0',
        },
      },

      '& .atb-qty-selector': {
        '& select': {
          '& > option': {
            color: 'var(--color-black-base)',
          },
        },
      },
      '&:has(.alter-cta-wrapper)': {
        minWidth: '310px',
      },
      '& .product-variation-message-error-container': {
        '& .product-info-message': {
          background: 'none',
          mb: 0,
        },
      },
    },

    addToBagContainer: {
      ...buttonContainerCommonStyles,
      backgroundColor: 'var(--color-black-base, #000)',
      transitionTimingFunction: 'ease',
      cursor: 'pointer',
      borderRadius: '800px',
      '&:not(.atb-container-disabled)': {
        '&:hover:not(:disabled), &:active': {
          backgroundColor: 'var(--color-green-500, #057550)',
          boxShadow:
            '0px 137px 38px 0px rgba(13, 84, 37, 0.01), 0px 88px 35px 0px rgba(13, 84, 37, 0.04), 0px 49px 30px 0px rgba(13, 84, 37, 0.15), 0px 22px 22px 0px rgba(13, 84, 37, 0.26), 0px 5px 12px 0px rgba(13, 84, 37, 0.29);',

          '& .chakra-select, & .chakra-button': {
            backgroundColor: 'var(--color-green-500, #057550)',
          },
        },
      },
    },
    addToBagControls: {
      alignItems: 'center',
      height: fullButtonHeight,
      overflow: 'hidden',
      borderRadius: '800px',
    },
    addToBagBtn: {
      ...theme.typography['text-cta2-xs'],
      color: 'var(--color-white-base, #fff)',
      padding: '0 30px 0 var(--spacing-3)',
      width: '100%',
      height: '50px',
      textTransform: 'none',
      fontSize: 'var(--text-12)',
      '&:disabled, &:disabled:hover': {
        color: 'var(--color-neutral-medium, #575757)',
        background: 'var(--color-neutral-light-3, #C5C5C5)',
        border: '1px solid var(--color-neutral-light-3, #C5C5C5)',
        opacity: 1,
      },
    },
    qtySelectorHidden: {
      paddingLeft: '30px',
    },
    qtyWrapper: {
      transition: 'all 400ms ease',

      '&::after': {
        display: 'block',
        content: '""',
        position: 'absolute',
        width: '1px',
        height: '30px',
        backgroundColor: 'var(--color-white-30)',
        top: 'calc(50% - 15px)',
        right: 0,
      },
    },
    alternateCtaWrapper: {
      ...buttonContainerCommonStyles,
      border: '1px solid var(--color-neutral-light-3, #C5C5C5)',
      borderRadius: '800px',
      overflow: 'hidden',
    },
    buyNowWrapper: {
      width: '100%',
    },
    buyNowButton: {
      ...alterCtaCommonStyles,
      ...theme.typography['text-cta2-xs'],
      color: 'var(--color-black-base, #000)!important',
      transitionTimingFunction: 'ease',
      flexGrow: 1,
      textTransform: 'none',
      fontSize: 'var(--text-12)',
      '&:hover:not(:disabled), &:active': alterCtaCommonHoverStyles,
      '&[disabled]': {
        backgroundColor: 'var(--color-black-base, #000) !important',
        color: 'var(--color-white-base, #FFF)!important',
        boxShadow: 'none !important',
        cursor: 'pointer !important',
      },
    },
    applePayWrapper: {
      width: '100%',
      ...alterCtaCommonStyles,
      '& .adyen-checkout__applepay__button': {
        display: 'flex',
        height: '40px',
        margin: '5px 0px',
        borderRadius: 0,
        border: 'none',
        width: '100%',
        '-webkit-appearance': '-apple-pay-button',
        '-apple-pay-button-style': 'white',
      },
      '& .merchant-checkout__payment-method': {
        backgroundColor: 'var(--color-white-base)',
        cursor: 'pointer',
      },
      '&.applePayContainer-disabled': {
        '& .merchant-checkout__payment-method': {
          pointerEvents: 'none',
        },
      },
      '&:not(:has(button))': {
        flexGrow: 0,
      },
    },
    membershipButtonArea: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      transition: 'all 400ms ease',
      '& .product-variation-message-error-container': {
        whiteSpace: 'nowrap',
      },
    },
  }),
  variants: {
    coachtopia: {
      rootContainer: {
        '& .notify-me, & .buy-now-button': {
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      addToBagBtn: {
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      membershipButtonArea: {
        '& span': {
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
    },
  },
}
