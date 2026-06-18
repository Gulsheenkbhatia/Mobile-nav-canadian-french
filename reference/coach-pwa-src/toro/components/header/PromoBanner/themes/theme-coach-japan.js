export default {
  baseStyle: ({ theme }) => ({
    bannerMainWrapper: {
      padding: `${theme.space.s1} ${theme.space.s3}`,
      '.header-banner': {
        '& .promo-item': {
          ...theme.typography['text-eyebrow1-m'],
        },
      },
      '@media (max-width: 769px)': {
        minHeight: '66px',
      },
    },
  }),
}
