export default {
  parts: [
    'rotatingBannerContainer',
    'slide',
    'slideActive',
    'slidePrev',
    'slideActiveLeft',
    'slidePrevRight',
    'arrowLeft',
    'arrowRight',
    'rootContainer',
    'pauseButton',
  ],
  baseStyle: ({ theme }) => ({
    rotatingBannerContainer: {
      marginBottom: 'var(--spacing-3)',
      width: '100%',
      height: '40px',
      overflow: 'hidden',
      position: 'relative',
      '.klarna-container': {
        margin: '0px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--color-white-base)',
        '.klarna-details': {
          width: 'auto',
        },
      },
      '.product-info-message-alert': {
        padding: '11px 0',
        background: 'var(--color-white-base)',
        svg: {
          display: 'none',
        },
        '.biz-inventory-status': {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
          fontWeight: 400,
          fontStyle: 'normal',
          lineHeight: 'var(--line-height-xl)',
          letterSpacing: 'var(--letter-spacing-xs)',
          fontSize: 'var(--text-12)',
          textAlign: 'center',
        },
      },
    },
    slide: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--color-white-base)',
      opacity: 0,
      transition: 'transform 1s cubic-bezier(0.49, 0.00, 0.47, 0.98)',
      '.product-info-message-alert': {
        marginBottom: 0,
      },
    },
    slideActive: {
      opacity: 1,
      zIndex: 1,
      animation: 'slideIn 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
    },
    slidePrev: {
      opacity: 1,
      animation: 'slideOut 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
    },
  }),
  variants: {
    horizontal: () => ({
      rootContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: 'var(--spacing-1)',
        marginBottom: 'var(--spacing-3)',
      },
      rotatingBannerContainer: {
        margin: 0,
      },
      slideActive: {
        animation: 'slideInHorizontal 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slidePrev: {
        animation: 'slideOutHorizontal 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slideActiveLeft: {
        opacity: 1,
        zIndex: 1,
        animation: 'slideInHorizontalLeft 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slidePrevRight: {
        opacity: 1,
        animation: 'slideOutHorizontalRight 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      arrowLeft: {
        cursor: 'pointer',
      },
      pauseButton: {
        cursor: 'pointer',
        '& svg': {
          transform: 'scale(2)',
          '& path:first-of-type': {
            fill: 'transparent',
          },
        },
      },
      arrowRight: {
        cursor: 'pointer',
      },
    }),
  },
}
