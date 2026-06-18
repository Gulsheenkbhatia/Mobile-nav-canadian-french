export default {
  baseStyle: ({ theme }) => ({
    bannerMainWrapper: {
      '.header-banner': {
        '& .promo-item': {
          ...theme.typography['text-eyebrow1-m'],
        },
      },
    },
  }),
}
