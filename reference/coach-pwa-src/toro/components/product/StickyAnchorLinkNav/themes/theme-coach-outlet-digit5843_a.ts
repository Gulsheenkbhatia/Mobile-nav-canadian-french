export default {
  baseStyle: ({ theme }) => ({
    stickyAnchorLinkNavContainer: () => ({
      margin: '0 var(--spacing-3)',
      height: '56px',
      zIndex: 10,
      background: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 'var(--border-radius-s)',
      backdropFilter: 'blur(7px)',
      boxShadow: '0px var(--spacing-1) 90px 0px var(--color-black-10)',
      padding: 'var(--spacing-3) var(--spacing-4)',
      gap: '20px',
    }),
    stickyAnchorLinkNavItems: ({ isActive }) => ({
      color: isActive ? 'var(--color-secondary)' : '#010101', // missing in the design token
      background: isActive ? 'var(--color-black-base)' : 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'center',
      borderRadius: '800px',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-140)',
      p: 'var(--spacing-2) 30px',
      zIndex: 9,
      position: `relative`,
    }),
    stickyAnchorLinkNavDecor: {
      display: 'none',
    },
  }),
}
