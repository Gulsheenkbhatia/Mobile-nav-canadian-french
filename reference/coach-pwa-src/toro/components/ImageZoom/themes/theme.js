export default {
  parts: [
    'desktopContainerStyles',
    'mobileContainerStyles',
    'imageStylesMobile',
    'imageStylesDesktop',
  ],
  baseStyle: () => ({
    desktopContainerStyles: {
      height: '100vh',
      maxHeight: '100vh',
      touchAction: 'auto',
      overflow: 'hidden',
      display: 'flex',
    },
    mobileContainerStyles: {
      touchAction: 'auto',
      width: '100vw',
      height: '100%',
    },
    imageStylesDesktop: {
      width: '100%',
      objectFit: 'contain',
      maxHeight: '100vh',
      userSelect: 'none',
    },
    imageStylesMobile: {
      position: 'absolute',
      overflow: 'hidden',
      inset: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      objectFit: 'cover',
      height: '100%',
      '&:not([src])': {
        display: 'none',
      },

      '& .splide__spinner': { display: 'none' },
    },
    aspectRatioForPdpV6: 1,
  }),
  variants: {
    pdpv5: {
      desktopContainerStyles: {
        height: '100%',
      },
    },
  },
}
