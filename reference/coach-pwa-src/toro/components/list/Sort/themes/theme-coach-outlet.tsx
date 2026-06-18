export default {
  parts: ['sortByText', 'sortButton'],
  variants: {
    desktopFilterV3: () => ({
      sortButton: {
        height: '30px',
        '& > span:first-of-type': {
          marginTop: '0',
        },
      },
    }),
  },
}
