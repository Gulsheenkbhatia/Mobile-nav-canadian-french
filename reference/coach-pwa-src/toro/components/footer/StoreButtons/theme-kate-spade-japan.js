export default {
  parts: [],
  baseStyle: () => ({
    storeButtonContainer: (isDesktop) => ({
      margin: isDesktop ? '0' : '0 auto',
      '& ul': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: isDesktop ? 'flex-start' : 'center',
      },
      '& li': {
        listStyle: 'none',
        '&:first-child': {
          mr: '16px',
        },
      },
      '& img': {
        height: '32px',
        width: 'auto',
      },
    }),
  }),
}
