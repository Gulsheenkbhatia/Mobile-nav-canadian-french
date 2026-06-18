export default {
  parts: [
    'container',
    'scrollWrapper',
    'tab',
    'tabActive',
    'tabInactive',
    'tabLabel',
    'activeIndicator',
  ],

  baseStyle: () => ({
    container: {
      position: 'sticky',
      top: 'var(--spacing-20)',
      zIndex: 10,
      bg: 'var(--color-neutral-light-1)',
      borderBottom: '1px solid var(--color-black-10)',

      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: 'var(--spacing-10)',

        pointerEvents: 'none',
        background: `linear-gradient(
          to right,
          rgba(240, 240, 240, 0) 0%,
          var(--color-neutral-light-1) 100%
        )`,
      },
    },

    scrollWrapper: {
      display: 'flex',
      width: '100%',
      height: '100%',
      overflowX: 'auto',
      whiteSpace: 'nowrap',

      '&::-webkit-scrollbar': {
        display: 'none',
      },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },

    tab: {
      position: 'relative',
      flex: '1 1 0%',
      minWidth: 'max-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      px: 'var(--spacing-4)',
      py: '20px',
      height: '100%',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      '&:focus-visible': {
        outline: '2px solid var(--color-black-base)',
        outlineOffset: '2px',
      },
    },

    tabLabel: {
      fontSize: 'var(--text-16)',
      fontWeight: 'normal',
      letterSpacing: '0.2px',
    },

    tabInactive: {
      color: 'var(--color-black-70)',
    },

    tabActive: {
      color: 'var(--color-black-base)',
    },

    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '3px',
      bg: 'var(--color-black-base)',

      transform: 'scaleX(1)',
      transformOrigin: 'left',
      transition: 'transform 0.3s cubic-bezier(0.56, 0.02, 0.17, 1)',
    },
  }),
}
