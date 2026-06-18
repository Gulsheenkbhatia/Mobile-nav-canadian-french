export default {
  baseStyle: ({ theme }) => ({
    styles: {
      navLinkText: (isDesktop) => ({
        ...(isDesktop ? theme.typography['text-body1-s'] : theme.typography['text-cta1-s']),
      }),
    },
  }),
}
