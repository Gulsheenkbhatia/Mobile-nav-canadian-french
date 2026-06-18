export default {
  parts: ['contentAreaOne', 'contentAreaTwo', 'contentAreaThree'],
  baseStyle: () => ({
    contentAreaOne: {
      '&.content-areaOne': {
        '& h1': {
          fontSize: '35px',
        },
      },
    },
    contentAreaTwo: {
      '&.content-areaTwo': {
        '@media (min-width: 769px)': {
          paddingTop: '33px',
        },
      },
    },
    contentAreaThree: {
      '&.content-areaThree': {
        '@media (min-width: 769px)': {
          paddingTop: '33px',
        },
        h1: {
          fontSize: '35px !important',
        },
      },
    },
  }),
}
