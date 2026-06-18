export default {
  baseStyle: ({ theme }) => ({
    styles: {
      navLinkText: (isDesktop) => ({
        ...(isDesktop
          ? {
              ...theme.typography['text-body2-s'],
            }
          : theme.typography['text-cta1-s']),
      }),
    },
  }),
}
