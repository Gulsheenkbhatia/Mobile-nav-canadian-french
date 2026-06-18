export default {
  parts: [
    'sortByText',
    'sortButton',
    'sortOptionsWrapper',
    'sortOptions',
    'sortOptionIconWrapper',
    'sortOptionsSRule',
  ],
  baseStyle: ({ theme }) => ({
    sortByText: {
      ...theme.typography['text-body1-s'],
    },
    sortButton: {
      '*': {
        ...theme.typography['text-body1-s'],
        fontWeight: 700,
      },
      '& svg': {},
    },
    sortOptions: {
      ...theme.typography['text-body1-s'],
    },
  }),
  variants: {
    desktopFilterV3: ({ theme }) => ({
      sortByText: {
        ...theme.typography['text-body1-l'],
        fontSize: 'var(--text-16)',
      },
      sortOptions: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&:hover': {
            backgroundColor: 'var(--neutrals-color-grey-100, #F7F7F7)',
          },
        },
      },
      sortButton: {
        marginBottom: '3px',
        '*': {
          ...theme.typography['text-body1-l'],
          fontFamily: 'var(--font-face1-bold)',
          fontWeight: 700,
          fontSize: 'var(--text-16)',
        },
        '& > span:first-of-type': {
          marginTop: '0',
        },
      },
    }),
  },
}
