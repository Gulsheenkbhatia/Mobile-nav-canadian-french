export default {
  variants: {
    marketingContentPdp: ({ theme }) => ({
      mt: theme.space.s1,
      mb: theme.space.s,
      mr: 'mar',
      '& label': {
        backgroundColor: theme.colors.main.inactive,
      },
    }),
  },
}
