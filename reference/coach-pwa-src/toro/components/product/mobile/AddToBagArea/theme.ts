const fullButtonHeight = '58px'

const buttonContainerCommonStyles = {
  flexGrow: 1,
  flexBasis: 0,
  height: fullButtonHeight,
  textTransform: 'none',
}

export const alterCtaCommonStyles = {
  backgroundColor: 'var(--color-secondary)',
  height: '100%',
  color: 'var(--color-primary)!important',
}

export default {
  parts: [
    'addToBagAreaWrapper',
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
    'addToBagAnimation',
    'addToBagAnimationProgress',
    'addToBagTextWrapper',
    'animationTextProgress',
  ],
  baseStyle: ({ theme, isCustomizedProduct }) => ({
    addToBagAreaWrapper: {
      '& .atb-variation-messages:has(.product-variation-message-error-container:empty)': {
        display: 'none',
      },
      '& .atb-variation-messages > div': {
        w: '100%',
      },
    },
    addToBagAreaWrapperSticky: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      animation: 'slideUpFadeIn 0.3s ease-out',

      '@keyframes slideUpFadeIn': {
        '0%': {
          transform: 'translateY(100%)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
      '& .atb-area': {
        backgroundColor: 'transparent',
        p: '6px',
      },
      '& .atb-variation-messages': {
        display: 'none',
      },
      '& .buy-now-button-wrapper': {
        backgroundColor: 'var(--color-white-base)',
      },
    },
    rootContainer: {
      height: '100%',
      p: 'var(--spacing-3) 10px var(--spacing-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      backgroundColor: 'var(--color-neutral-light)',

      '& .atb-qty-selector': {
        '& select': {
          '& > option': {
            color: 'var(--color-background-filter-pill-counter)',
          },
        },
      },
    },
    addToBagControlsWrapper: {
      gap: 'var(--spacing-1)',
      ...(isCustomizedProduct && {
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        '& > .atb-container, & > .alter-cta-wrapper': {
          flexBasis: 'auto',
          flexGrow: 0,
          width: '100%',
        },
      }),
    },
    addToBagContainer: {
      ...buttonContainerCommonStyles,
      w: '49%',
    },
    addToBagControls: {
      alignItems: 'center',
      height: fullButtonHeight,
      overflow: 'hidden',
      borderRadius: 'var(--border-radius-m)',
      backgroundColor: 'var(--color-background-filter-pill-counter)',
      '&:has(button:disabled)': {
        backgroundColor: 'var(--color-neutral-light-2, #E1E1E1)',
      },
    },
    addToBagBtn: {
      ...theme.typography['text-cta2-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-white-base)',
      padding: 'var(--spacing-6) var(--spacing-10) 20px',
      width: '100%',
      height: '58px',
      textTransform: 'none',
      fontSize: 'var(--text-14)',
      backgroundColor: 'var(--color-background-filter-pill-counter)',
      '&:disabled, &:disabled:hover': {
        color: 'var(--neutrals-grey-600, #6D6D6D)',
        backgroundColor: 'var(--color-neutral-light-2, #E1E1E1)',
        border: '1px solid var(--color-neutral-light-2, #E1E1E1)',
        opacity: 1,
      },
      '&:not(.atb-container-disabled)': {
        '&:hover:not(:disabled), &:active:not(:disabled)': {
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-background-filter-pill-counter)',
        },
      },
    },
    qtyWrapper: {
      transition: 'all 400ms ease',
      opacity: 1,
      transform: 'scale(1)',

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

      '&.qty-selector-hidden': {
        opacity: 0,
        transform: 'scale(0.8)',
        width: 0,
        overflow: 'hidden',
      },
    },
    alternateCtaWrapper: {
      ...buttonContainerCommonStyles,
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
    },
    buyNowWrapper: {
      width: '100%',
    },
    buyNowButton: {
      ...alterCtaCommonStyles,
      ...theme.typography['text-cta2-s'],
      color: 'var(--color-primary)!important',
      flexGrow: 1,
      textTransform: 'none',
      fontSize: 'var(--text-14)',
      p: 'var(--spacing-6) var(--spacing-10) 20px',
      '&[disabled]': {
        backgroundColor: 'var(--color-black-base, #000) !important',
        color: 'var(--color-white-base, #FFF)!important',
        boxShadow: 'none !important',
      },
    },
    applePayWrapper: {
      width: '100%',
      ...alterCtaCommonStyles,
      '& .adyen-checkout__applepay__button': {
        display: 'flex',
        height: '40px',
        margin: '8px 0px',
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
      gap: '10px',
    },
    addToBagAnimation: {
      position: 'relative',
      overflow: 'hidden',
      height: fullButtonHeight,
      borderRadius: 'var(--border-radius-m)',
      backgroundColor: 'var(--color-green-500)',
      width: '100%',
      flex: 1,
    },
    addToBagAnimationProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'var(--color-background-filter-pill-counter)',
      '&.active': {
        animationName: 'atb-progress',
        animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
        animationDuration: 'var(--transition-duration-gentle)',
        animationFillMode: 'forwards',
      },
      '&.complete': {
        transition: 'all var(--transition-delay-quick) cubic-bezier(0.83, 0, 0.17, 1) !important',
        transform: 'translateX(100%)',
      },
    },
    addToBagTextWrapper: {
      '& .text-slider': {
        position: 'relative',
        height: '100%',
        width: '100%',
        transition: 'all 300ms ease-in-out',
      },
      '& .text-slider.sliding': {
        transform: 'translateY(-100%)',
      },
      '& .text-slider.sliding .add-to-cart': {
        transition: 'all 150ms ease-in-out',
        opacity: 0,
      },
      position: 'relative',
      height: '100%',
      width: '100%',
    },
    animationTextProgress: {
      fontSize: 'var(--text-14)',
      fontFamily: 'var(--font-face1-extended-normal)',
      letterSpacing: 'var(--letter-spacing-xl)',
      fontStyle: 'normal',
      fontWeight: '400',
      color: 'var(--color-white-base)',
      height: '100%',
      width: '100%',
      position: 'absolute',
    },
  }),
}
