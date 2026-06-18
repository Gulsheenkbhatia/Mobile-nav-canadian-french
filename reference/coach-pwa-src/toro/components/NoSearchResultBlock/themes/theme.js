export default {
  parts: [],
  baseStyle: () => ({
    popularSearchItemContainer: ({ isDesktop, isMobile }) => ({
      position: 'relative',
      width: isMobile ? '131px' : isDesktop ? '200px' : '141px',
      marginRight: '10px',
    }),
  }),
}
