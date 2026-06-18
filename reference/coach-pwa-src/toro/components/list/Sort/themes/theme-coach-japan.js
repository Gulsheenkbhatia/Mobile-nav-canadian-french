export default {
  parts: ['sortByText', 'sortButton'],
  baseStyle: ({ theme }) => ({
    sortByText: {
      ...theme.typography['text-body1-s'],
    },
    sortButton: {
      '*': {
        ...theme.typography['text-body1-s'],
      },
      '& svg': {},
    },
    sortOptions: {
      ...theme.typography['text-body1-s'],
    },
  }),
  variants: {
    desktopFilterV3: () => ({
      sortByText: {
        fontSize: 'var(--text-14)',
      },
      sortButton: {
        height: '30px',
        fontWeight: 700,
        '& > span:first-of-type': {
          marginTop: '0',
          fontSize: 'var(--text-14)',
        },
      },
    }),
  },
}
