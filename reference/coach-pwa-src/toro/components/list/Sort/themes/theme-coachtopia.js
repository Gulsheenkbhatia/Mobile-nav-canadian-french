export default {
  parts: ['sortByText', 'sortButton'],
  baseStyle: ({ theme }) => ({
    sortByText: {
      ...theme.typography['text-body2-s'],
    },
  }),
  variants: {
    desktopFilterV3: () => ({
      sortByText: {
        fontFamily: 'var(--font-face1-normal)',
      },
      sortButton: {
        height: '30px',
        '& > span:first-of-type': {
          marginTop: '0',
        },
      },
    }),
  },
}
