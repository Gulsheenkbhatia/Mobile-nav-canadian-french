export default {
  baseStyle: ({ theme }) => ({
    stickyAnchorLinkNavContainer: () => ({
      ...theme.typography['text-body1-s'],
      position: 'unset',
      overflowX: 'auto',
      zIndex: 10,
      '::-webkit-scrollbar': { display: 'none' },
      '::-webkit-scrollbar-track': { display: 'none' },
      '::-webkit-scrollbar-thumb': { display: 'none' },
      '-ms-overflow-style': 'none' /* IE and Edge */,
      'scrollbar-width': 'none' /* Firefox */,
    }),
    stickyAnchorLinkNavDecor: {
      borderBottom: `none`,
    },
  }),
}
