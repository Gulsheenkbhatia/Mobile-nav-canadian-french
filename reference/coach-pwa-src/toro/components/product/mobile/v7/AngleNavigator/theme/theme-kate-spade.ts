export default {
  parts: [
    'angleWrapper',
    'angleScroll',
    'angleItem',
    'angleItemActive',
    'angleItemInactive',
    'angleLabel',
    'fadeLeft',
    'fadeRight',
  ],

  baseStyle: ({ theme, isDiscoverMode }) => ({
    angleWrapper: {
      mt: 'var(--spacing-4)',
      px: 'var(--spacing-4)',
      py: 'var(--spacing-3)',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      opacity: isDiscoverMode ? 1 : 0,
      transform: isDiscoverMode ? 'translateY(0)' : 'translateY(12px)',
    },

    angleScroll: {
      display: 'flex',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      gap: 'var(--spacing-2)',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      px: 'var(--spacing-1)',
      py: 'var(--spacing-1)',
      borderRadius: 'var(--border-radius-full)',
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },

    angleItem: {
      flex: '1 1 0%',
      minWidth: 'max-content',
      px: 'var(--spacing-4)',
      py: 'var(--spacing-2)',
      borderRadius: 'var(--border-radius-full)',
      cursor: 'pointer',
      scrollSnapAlign: 'center',
      transition: 'all 0.25s ease',
      transform: 'scale(1)',
    },
    angleItemActive: {
      bg: 'var(--color-background-cta-pill-bg)',
      color: 'var(--color-black-base)',
      transform: 'scale(1.05)',
      boxShadow: `
          0 4px 12px rgba(0,0,0,0.08),
          0 2px 4px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.8)
        `,
    },

    angleItemInactive: {
      bg: 'transparent',
      opacity: 0.7,
    },

    angleLabel: {
      ...theme.typography['text-body1-l'],
      fontSize: 'var(--text-14)',
      fontWeight: 400,
      letterSpacing: 'var(--letter-spacing-l)',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      width: '100%',
      color: 'var(--color-black-base)',
    },

    fadeLeft: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 'var(--spacing-8)',
      pointerEvents: 'none',
      bg: 'linear-gradient(to right, var(--color-neutral-light-1) 0%, transparent 100%)',
    },

    fadeRight: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 'var(--spacing-8)',
      pointerEvents: 'none',
      bg: 'linear-gradient(to left, var(--color-neutral-light-1) 0%, transparent 100%)',
    },
  }),
}
