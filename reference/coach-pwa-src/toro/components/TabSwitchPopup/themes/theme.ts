export default {
  parts: ['container', 'closeButton', 'content', 'message'],
  baseStyle: ({ theme }) => ({
    container: {
      alignItems: 'flex-end',
      flexDirection: 'column',
      gap: theme.space.s,
      padding: `${theme.space.mar} ${theme.space.mar} ${theme.space.xl}`,
      backgroundColor: theme.colors.main.secondary,
      boxShadow: '0 0 20px 3px rgba(0, 0, 0, 0.35)',
      borderRadius: '8px',
      minWidth: '321px',
      animation: 'fadeIn 0.3s ease-in-out',
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    },
    closeButton: {
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'column',
      gap: theme.space.s,
      width: '100%',
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      color: theme.colors.main.primary,
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: theme.fontSizes.sm,
      letterSpacing: theme.letterSpacings.xs,
      lineHeight: theme.lineHeights.lg,
      fontWeight: 'normal',
    },
  }),
}
