export default {
  parts: ['paidyContainer', 'paidySkeleton'],
  baseStyle: () => ({
    paidyContainer: {
      height: '38px',
      '& ._paidy-promotional-messaging': {
        margin: '0!important',
        padding: '0!important',
        position: 'relative',
      },
      '& ._paidy-promotional-messaging > div': {
        mt: '-5px',
        ml: '-15px',
        position: 'absolute',
      },
    },
    paidySkeleton: {
      width: '100%',
      height: '50px',
    },
  }),
  variants: {
    rotatingBanner: {
      paidyContainer: {
        height: 'fit-content',
        '& ._paidy-promotional-messaging': {
          margin: '0!important',
          padding: '0!important',
          position: 'relative',
          width: 'fit-content!important',
        },
        '& ._paidy-promotional-messaging > div': {
          margin: '0!important',
          position: 'relative',
        },
      },
    },
    belowCta: {
      paidyContainer: {
        width: '100%',
        height: 'fit-content',
        minHeight: '38px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& ._paidy-promotional-messaging': {
          margin: '0!important',
          padding: '0!important',
          position: 'relative',
          width: 'fit-content!important',
        },
        '& ._paidy-promotional-messaging > div': {
          margin: '0!important',
          position: 'relative',
          ml: '0',
          mt: '0',
        },
      },
    },
  },
}
