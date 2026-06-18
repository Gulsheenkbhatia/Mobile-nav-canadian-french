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
  parts: ['overlayContainer', 'overlayContainerHidden', 'stickyContainer'],
  baseStyle: ({ theme }) => ({
    overlayContainer: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bg: 'var(--color-scrim-dark)',
      cursor: 'pointer',
      zIndex: 200,
      WebkitTapHighlightColor: 'transparent',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        bg: 'var(--color-black-50)',
      },
    },
    overlayContainerHidden: {
      width: 0,
      height: 0,
      zIndex: 200,
    },
    stickyContainer: {
      ...stickyContainerStyles,
      borderRadius: 'var(--border-radius-m) var(--border-radius-m) 0 0',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...stickyContainerStylesMobile,
        background: 'var(--color-white-base)',
      },
    },
  }),
}
