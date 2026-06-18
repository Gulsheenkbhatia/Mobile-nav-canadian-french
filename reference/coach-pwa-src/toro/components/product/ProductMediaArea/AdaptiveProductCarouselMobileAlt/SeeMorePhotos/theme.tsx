export default {
  baseStyle: ({ theme }) => ({
    button: {
      position: 'absolute',
      bottom: 'calc(var(--spacing-10) + var(--spacing-8))',
      right: 'var(--spacing-3)',
      p: 'var(--spacing-4)',
      zIndex: 13,
      borderRadius: 'var(--border-radius-full)',
      background: theme.colors.main.white,
      color: theme.colors.main.black,

      textTransform: 'none',
      fontFamily: 'var(--font-face1-bold)',
      fontWeight: 500,
      fontSize: 'var(--text-10)',
      lineHeight: '1.125', // doesnt exist in design system
      letterSpacing: '0.02em', // doesnt exist in design system
      textAlign: 'center',
    },
  }),
  variants: {
    bottomMost: () => ({
      button: {
        bottom: 'var(--spacing-4)',
      },
    }),
  },
}
