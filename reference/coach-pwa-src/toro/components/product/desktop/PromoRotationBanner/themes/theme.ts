export default {
  baseStyle: () => ({
    promoRotationBanner: {
      height: '100%',
      flexGrow: 1,
      maxWidth: '20%',
      minWidth: '12%',
      '& .rotating-banner': {
        width: '100%',
        height: '50px',
        mb: 0,
      },
      '& .callout-message-container': {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        '& > div': {
          m: 0,
          width: '100%',
          '& span': {
            textAlign: 'center',
            minWidth: '100% !important',
          },
        },
      },
    },
  }),
}
