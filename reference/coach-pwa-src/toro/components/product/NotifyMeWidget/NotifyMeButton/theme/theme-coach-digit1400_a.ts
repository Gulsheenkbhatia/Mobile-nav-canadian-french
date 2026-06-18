export default {
  baseStyle: ({ theme, isBundleVariant }) => ({
    notifyMeButton: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-2)',
        height: '57px',
      },
      color: isBundleVariant ? theme.colors.main.black : theme.colors.main.secondary,
      '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      notifyMeButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: 'var(--spacing-4)',
        },
      },
    }),
  },
}
