export default {
  parts: ['sortByText', 'sortButton'],

  variants: {
    desktopFilterV3: () => ({
      sortByText: {
        fontSize: 'var(--text-14)',
      },
      sortButton: {
        fontWeight: 700,
        fontSize: 'var(--text-14)',
      },
    }),
  },
}
