export default {
  baseStyle: ({ theme }) => ({
    imageContainerDimensions: {
      width: '600px',
    },
    t1MenuContainer: {
      boxShadow: theme.boxShadow.header,
      p: '0 calc((100vw - 1344px) / 2)',
    },
    desktopMenuImageContainer: {
      width: 'auto',
      height: '480px',
    },
    desktopMenuImage: {
      objectFit: 'contain',
    },
  }),
}
