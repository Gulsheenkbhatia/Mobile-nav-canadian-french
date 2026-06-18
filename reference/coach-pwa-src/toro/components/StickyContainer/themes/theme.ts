const stickyContainerStyles = {
  position: 'fixed',
  bg: 'var(--color-white-base)',
  zIndex: 200,
  bottom: '20px',
  right: '69px',
  p: `mar mar mar 23.5px`,
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  borderRadius: 'var(--border-radius-xs)',
  padding: 'var(--chakra-space-m)',
}

const stickyContainerStylesMobile = {
  bottom: 0,
  w: '100%',
  left: 0,
  background: 'var(--color-white-80)',
  boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
  backdropFilter: 'blur(26px)',
  p: 'mar',
  animationName: 'sticky-blur-jump',
  animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
  animationDuration: 'var(--transition-duration-quick)',
  animationFillMode: 'forwards',
}

export default {
  parts: ['stickyOuterContainer', 'overlayContainer', 'overlayContainerHidden', 'stickyContainer'],
  baseStyle: ({ theme }) => ({
    stickyOuterContainer: {
      h: 0,
      w: '100%',
    },
    overlayContainer: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bg: 'rgba(0, 0, 0, 0.75)',
      cursor: 'pointer',
      zIndex: 200,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        bg: 'rgba(0, 0, 0, 0.5)',
      },
    },
    overlayContainerHidden: {
      width: 0,
      height: 0,
      zIndex: 200,
    },
    stickyContainer: (stickyAddToCartPriceEnabled, isFlyoutOpen) => ({
      ...stickyContainerStyles,
      w: isFlyoutOpen ? '470px' : stickyAddToCartPriceEnabled ? '321px' : '250px',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...stickyContainerStylesMobile,
        '& .adyen-checkout__applepay__button': {
          marginTop: 'var(--spacing-2)',
          height: '57px',
          padding: 'var(--spacing-4) var(--spacing-6)',
        },
      },
    }),
  }),
  variants: {
    plpSizeGuide: ({ theme }) => ({
      stickyContainer: () => ({
        ...stickyContainerStyles,
        borderRadius: 'var(--border-radius-m) var(--border-radius-m) 0 0',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...stickyContainerStylesMobile,
          background: 'var(--color-white-base)',
        },
      }),
      overlayContainer: {
        cursor: 'auto',
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      stickyContainer: () => ({
        ...stickyContainerStyles,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...stickyContainerStylesMobile,
          padding: 0,
          '& .adyen-checkout__applepay__button': {
            '-webkit-appearance': '-apple-pay-button',
            '-apple-pay-button-style': 'white',
          },
        },
      }),
    }),
  },
}
