export default {
  baseStyle: () => ({
    miniCartPopUpPosition: (isDesktop, isStaticHeader) => ({
      top: isDesktop ? (isStaticHeader ? '105px' : '70px') : '90px',
      right: isDesktop ? (isStaticHeader ? '37px' : '-11px') : '15px',
    }),
    styleForStickyHeader: ({ isStickyHeader, bannerHeight, isHeaderHidden }) => {
      return (
        isStickyHeader && {
          position: 'sticky',
          top: isHeaderHidden ? 'initial' : `-${bannerHeight}px`,
          zIndex: 15,
          transition: 'top 150ms ease-in-out',
        }
      )
    },
    pdpV7TapToDiscoverImmersive: {
      visibility: 'hidden',
      overflow: 'hidden',
      height: 0,
      minHeight: 0,
      pointerEvents: 'none',
    },
  }),
  variants: {
    transparentStickyHeaderFullBleed: () => ({
      headerPageContainer: {
        backgroundColor: null,
      },
    }),
  },
}
