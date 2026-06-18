export default {
  parts: [
    'swatchesOuter',
    'swatchesScroll',
    'swatchItem',
    'swatchLink',
    'swatchCard',
    'swatchImage',
    'swatchActiveIndicator',
    'swatchFadeLeftWhite',
    'swatchFadeRightWhite',
  ],

  baseStyle: () => ({
    swatchesOuter: {
      position: 'relative',
      isolation: 'isolate',
    },

    swatchesScroll: {
      overflowX: 'auto',
      gap: '10px',
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      zIndex: 1,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },

    swatchItem: {
      flex: '0 0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },

    swatchLink: {
      display: 'block',
      flexShrink: 0,
      lineHeight: 0,
      textDecoration: 'none',
      color: 'inherit',
    },

    swatchCard: {
      display: 'block',
      boxSizing: 'border-box',
      width: 'var(--spacing-16)',
      height: 'var(--spacing-20)',
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
      cursor: 'pointer',
      flexShrink: 0,
      position: 'relative',

      '&.swatch-non-selectable': {
        cursor: 'not-allowed',
      },

      '&.out-of-stock::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'var(--color-scrim-dark)',
        zIndex: 1,
        opacity: 0.3,
      },

      '&.out-of-stock::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '1px',
        height: '90%',
        backgroundColor: 'var(--color-secondary)',
        transform: 'translateX(-50%) rotate(45deg)',
        zIndex: 2,
        pointerEvents: 'none',
      },
    },
    swatchImage: {
      display: 'block',
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      objectFit: 'cover',
    },

    swatchActiveIndicator: {
      position: 'absolute',
      bottom: 'var(--spacing-1)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'var(--spacing-8)',
      height: '2px',
      bg: 'var(--color-black-base)',
      borderRadius: 'var(--border-radius-full)',
      zIndex: 3,
      pointerEvents: 'none',
    },

    swatchFadeLeftWhite: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 'var(--spacing-8)',
      zIndex: 0,
      pointerEvents: 'none',
      bg: 'linear-gradient(to right, var(--color-neutral-light-1) 0%, rgba(255,255,255,0) 100%)',
    },

    swatchFadeRightWhite: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 'var(--spacing-8)',
      zIndex: 0,
      pointerEvents: 'none',
      bg: 'linear-gradient(to left, var(--color-neutral-light-1) 0%, rgba(255,255,255,0) 100%)',
    },
  }),
}
