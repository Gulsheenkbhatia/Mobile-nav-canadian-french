export default {
  parts: ['contentAreaOne', 'contentAreaTwo', 'contentAreaThree'],
  baseStyle: ({ theme }) => ({
    contentAreaOne: {
      paddingTop: 0,
      paddingBottom: 0,
      '&.content-areaOne': {
        '& h1': {
          fontSize: theme.fontSizes.double,
        },
        '& .at-eyebrow-text': {
          marginBottom: theme.space.m,
        },
      },
    },
    contentAreaTwo: {
      '&.content-areaTwo': {
        p: {
          marginBottom: theme.space.m,
        },
        '@media (min-width: 769px)': {
          '& .header-block-position': {
            left: '50%',
          },
          paddingTop: theme.space.xl,
        },
        '@media (max-width: 769px)': {
          '.mol-banner-50-50': {
            '.right-container .mol-header-block': {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
      },
    },
    contentAreaThree: {
      '&.content-areaThree': {
        p: {
          marginBottom: theme.space.m,
        },
        '@media (min-width: 769px)': {
          '& .header-block-position': {
            left: '50%',
          },
          paddingTop: theme.space.xl,
        },
        h1: {
          fontSize: theme.fontSizes.double,
        },
      },
    },
  }),
}
