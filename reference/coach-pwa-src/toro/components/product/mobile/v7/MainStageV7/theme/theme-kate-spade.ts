export default {
  parts: [
    'container',
    'discoverOverlayRoot',
    'heroWrapper',
    'heroWrapperImmersive',
    'heroWrapperDiscover',
    'productInfoSection',
    'pricePromotionsRow',
    'pricePromotionItem',
    'discoverKateSpadeTop',
    'discoverSpadeRow',
    'mainContent',
    'mainContentHidden',
    'galleryWrapper',
    'galleryWrapperImmersive',
    'galleryWrapperImmersiveMain',
    'galleryWrapperImmersiveDiscover',
    'galleryWrapperDiscover',
    'galleryEntranceLayer',
    'galleryEntranceLayerDiscover',
    'tapWrapper',
    'tapFlex',
    'tapTextContainer',
    'tapText',
    'tapDivider',
    'tapIconContainer',
    'closeWrapper',
    'closeWrapperDiscover',
    'closeButton',
    'swatchWrapper',
    'angleWrapper',
    'lowerActionsSlot',
  ],

  baseStyle: () => ({
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      bg: 'var(--color-neutral-light-1)',
      height: '100%',
    },

    discoverOverlayRoot: {
      position: 'fixed',
      inset: 0,
      zIndex: 'var(--chakra-zIndices-overlay)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100%',
      minHeight: 0,
      height: '100dvh',
      maxHeight: '100dvh',
      boxSizing: 'border-box',
      overflow: 'hidden',
      overscrollBehavior: 'none',
      bg: 'var(--color-neutral-light-1)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    },

    heroWrapper: {
      px: '10px',
      pt: 'var(--spacing-4)',
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100%',
      transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
      transformOrigin: 'top center',
      transform: 'scale(1)',
      opacity: 1,
    },
    heroWrapperImmersive: {
      px: 0,
      pt: 0,
    },
    heroWrapperDiscover: {
      pt: 0,
      alignItems: 'stretch',
      overflowX: 'hidden',
      overflowY: 'visible',
    },

    productInfoSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: 'var(--spacing-2)',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
    },
    pricePromotionsRow: {
      width: '100%',
      alignSelf: 'stretch',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--spacing-2)',

      '& > :last-child:nth-child(odd)': {
        gridColumn: 'span 2',
      },
    },
    pricePromotionItem: {
      minWidth: 0,
    },

    discoverKateSpadeTop: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: 'var(--spacing-3)',
      bg: 'var(--color-neutral-light-1)',
    },
    discoverSpadeRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      pt: 'var(--spacing-8)',
      color: 'var(--color-black-base)',
      '& svg': {
        display: 'block',
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
      },
    },

    mainContent: {
      width: '100%',
    },
    mainContentHidden: {
      visibility: 'hidden',
      pointerEvents: 'none',
      opacity: 0,
    },

    galleryWrapper: {
      mt: 'var(--spacing-2)',
      flex: 1,
      minHeight: 0,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    galleryWrapperImmersive: {
      height: '100%',
    },
    galleryWrapperImmersiveMain: {
      mt: 0,
    },
    galleryWrapperImmersiveDiscover: {
      mt: 'var(--spacing-3)',
    },
    galleryWrapperDiscover: {
      cursor: 'default',
      overflowX: 'hidden',
      overflowY: 'visible',
    },

    galleryEntranceLayer: {},
    galleryEntranceLayerDiscover: {
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignSelf: 'stretch',
      overflowX: 'hidden',
      overflowY: 'visible',
    },

    tapWrapper: {
      position: 'absolute',
      bottom: '3px',
      left: '50%',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },

    tapFlex: {
      alignItems: 'center',
      height: 'var(--spacing-8)',
      display: 'flex',
    },

    tapTextContainer: {
      paddingRight: 'var(--spacing-3)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },

    tapText: {
      fontSize: 'var(--text-12)',
      fontWeight: 500,
      letterSpacing: 'var(--letter-spacing-xl)',
      textAlign: 'right',
      lineHeight: '15px',
    },

    tapDivider: {
      width: '1.3px',
      height: '100%',
      background: 'var(--color-black-base)',
    },

    tapIconContainer: {
      paddingLeft: 'var(--spacing-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    closeWrapper: {
      flexShrink: 0,
      mt: 'var(--spacing-4)',
      display: 'flex',
      justifyContent: 'center',
      transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      opacity: 0,
      transform: 'translateY(calc(-1 * var(--spacing-2)))',
    },
    closeWrapperDiscover: {
      mt: 'var(--spacing-2)',
      mb: 'var(--spacing-1)',
      opacity: 1,
      transform: 'translateY(0)',
      width: '100%',
      maxWidth: '100%',
      alignSelf: 'stretch',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    closeButton: {
      p: '10px',
      width: '56px',
      height: '44px',
      minW: '56px',
      borderRadius: 'var(--border-radius-full)',
      bg: 'var(--color-neutral-light-1)',
      border: '1px solid rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      boxShadow: `
      0 6px 16px rgba(0,0,0,0.10),
      0 2px 4px rgba(0,0,0,0.06),
      inset 0 1px 0 rgba(255,255,255,0.9)
    `,
      '& svg': {
        display: 'block',
        flexShrink: 0,
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
      },

      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: `
        0 8px 20px rgba(0,0,0,0.14),
        0 3px 6px rgba(0,0,0,0.08)
        `,
      },

      '&:active': {
        transform: 'scale(0.96)',
        boxShadow: `
        inset 0 2px 6px rgba(0,0,0,0.12)
      `,
      },
    },

    swatchWrapper: {
      mt: 'var(--spacing-2)',
    },

    angleWrapper: {
      flexShrink: 0,
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      overflowX: 'hidden',
      position: 'relative',
      zIndex: 1,
      bg: 'var(--color-neutral-light-1)',
    },

    lowerActionsSlot: {
      flexShrink: 0,
      width: '100%',
      position: 'relative',
      zIndex: 2,
      bg: 'var(--color-neutral-light-1)',
    },
  }),
}
