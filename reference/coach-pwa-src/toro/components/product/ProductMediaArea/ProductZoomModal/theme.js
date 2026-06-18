export default {
  baseStyle: () => ({
    zoomModal: {
      m: '0',
      borderRadius: 'none',
      '&.zoomModal': {
        '.slick-prev': {
          ' @media (min-width: 769px)': {
            left: '0px',
          },
        },
        '.slick-next': {
          ' @media (min-width: 769px)': {
            left: '0px',
          },
        },
      },
    },
  }),
}
