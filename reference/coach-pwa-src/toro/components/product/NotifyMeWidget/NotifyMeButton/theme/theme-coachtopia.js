export default {
  baseStyle: ({ theme, isBundleVariant }) => ({
    notifyMeButton: {
      color: isBundleVariant ? theme.colors.main.black : theme.colors.main.secondary,
      '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
      ...theme.typography['text-cta1-m'],
    },
  }),
}
