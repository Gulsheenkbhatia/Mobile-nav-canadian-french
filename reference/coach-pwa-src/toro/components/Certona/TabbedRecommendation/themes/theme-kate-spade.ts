export default {
  baseStyle: ({ theme }) => ({
    certonaTabbedContainer: {
      backgroundColor: 'var(--color-white-base)',
    },
    tab: {
      backgroundColor: 'var(--color-white-base)',
      fontFamily: 'var(--font-face1-normal)',
    },
    tabList: {
      marginBottom: 'var(--spacing-1)',
    },
    viewAllContainer: {
      paddingTop: 'var(--spacing-6)',
    },
    title: {
      ...theme.typography['text-display1-ms'],
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-28)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-s)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display1-m'],
        fontWeight: 400,
      },
    },
    viewAllProductLink: {
      padding: 'var(--spacing-3)',
      paddingTop: '10px',
      borderRadius: 'var(--border-radius-full)',
    },
    viewAllText: {
      ...theme.typography['text-body1-m'],
      fontSize: 'var(--text-14)',
    },
  }),
  variants: {
    tabbedRecommendation: ({ theme }) => ({
      tabList: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mb: 0,
        },
      },
      tab: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-black-base)',
          ...theme.typography['text-body1-s'],
        },
      },
      selectedTab: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-black-base)',
        },
      },
      viewAllText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-xs'],
        },
      },
    }),
  },
}
