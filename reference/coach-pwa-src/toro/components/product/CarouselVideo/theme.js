export default {
  baseStyle: ({ theme }) => ({
    heroImgIconStyleProps: (
      isDesktop,
      isQuickView,
      isTangibleeEnabled,
      membershipExclusiveProduct
    ) => ({
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'absolute',
      top: isDesktop
        ? isQuickView
          ? membershipExclusiveProduct
            ? '134px'
            : '86px'
          : isTangibleeEnabled
          ? membershipExclusiveProduct
            ? '180px'
            : '130px'
          : membershipExclusiveProduct
          ? '140px'
          : '96px'
        : isTangibleeEnabled
        ? membershipExclusiveProduct
          ? '170px'
          : '126px'
        : membershipExclusiveProduct
        ? '132px'
        : '82px',
      right: isDesktop ? (isQuickView ? '1%' : '0.5%') : '0',
      gap: isQuickView ? '20px' : '26px',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      '& svg': {
        width: '20px',
        height: '20px',
      },
      '& path': {
        fill: 'transparent',
        stroke: theme.colors.main.black,
      },
    }),
    blurredOverLay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(5px)',
    },
  }),
  variants: {
    adaptiveTabbedPDP: () => ({
      heroImgIconStyleProps: () => ({
        alignItems: 'flex-start',
        position: 'absolute',
        gap: '16px',
        right: '16px',
        top: '12px',
        flexDirection: 'column-reverse',
        cursor: 'pointer',
        '& svg': {
          width: '40px',
          height: '40px',
        },
      }),
      heroImgIconTransparentHeaderStyle: {
        top: '68px',
      },
    }),
    pdpv6: {
      heroImgIconStyleProps: () => ({
        display: 'flex',
        gap: 'var(--spacing-2)',
        position: 'absolute',
        bottom: 0,
        right: '0',
        padding: 'var(--spacing-3)',
        '& svg,& svg.pause_svg__icon-video-pause,& svg.play_svg__icon-video-play': {
          width: '40px',
          height: '40px',
        },
      }),
    },
    pdpv7: {
      heroImgIconStyleProps: () => ({
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        gap: 'var(--spacing-2)',
        position: 'absolute',
        bottom: 0,
        right: '0',
        padding: 'var(--spacing-3)',
        '& svg': {
          width: '56px',
          height: '44px',
        },
      }),
    },
  },
}
