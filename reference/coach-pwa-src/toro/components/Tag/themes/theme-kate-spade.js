export default {
  parts: ['appliedFilterText'],
  baseStyle: ({ theme }) => ({
    appliedFilterText: {
      ...theme.typography['text-body1-s'],
      color: theme.colors.main.gray,
    },
  }),
  variants: {
    tagV3: ({ theme }) => ({
      appliedFilterText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginBottom: '3px',
        },
      },
    }),
  },
}
