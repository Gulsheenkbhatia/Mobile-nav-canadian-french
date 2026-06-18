const paidyContainerStyles = {
  height: '45px',
  '& ._paidy-promotional-messaging': {
    margin: '0!important',
    padding: '0!important',
    position: 'relative',
  },
  '& ._paidy-promotional-messaging > div': {
    mt: '-10px',
    ml: '-15px',
    position: 'absolute',
  },
  paidySkeleton: {
    width: '100%',
    height: '60px',
  },
}

export default {
  parts: ['paidyContainer', 'paidySkeleton'],
  baseStyle: () => ({
    paidyContainer: {
      height: '45px',
      '& ._paidy-promotional-messaging': {
        margin: '0!important',
        padding: '0!important',
        position: 'relative',
      },
      '& ._paidy-promotional-messaging > div': {
        mt: '-10px',
        ml: '-15px',
        position: 'absolute',
      },
      paidySkeleton: {
        width: '100%',
        height: '60px',
      },
    },
  }),
  variants: {
    underline: {
      paidyContainer: {
        ...paidyContainerStyles,
        '& ._paidy-promotional-messaging': {
          margin: '0!important',
          padding: '0!important',
          position: 'relative',

          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--color-inactive)',
            top: '42px',
          },
        },
      },
    },
  },
}
