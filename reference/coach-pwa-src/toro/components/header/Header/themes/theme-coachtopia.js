export default {
  baseStyle: () => ({
    styleForStickyHeader: ({ isStickyHeader, bannerHeight, isProductPassport, isHeaderHidden }) => {
      return (
        isStickyHeader && {
          position: 'sticky',
          top: isProductPassport ? 0 : isHeaderHidden ? 'initial' : -bannerHeight,
          zIndex: 21,
          transition: 'top 150ms ease-in-out',
        }
      )
    },
    styleForUpperRows: ({ showBanner, isProductPassport, promoBannerIsHidden }) => {
      const initialHideStyles = {
        position: showBanner ? 'relative' : 'fixed',
        top: 0,
        width: '100%',
      }

      return {
        visibility: !showBanner && isProductPassport ? 'hidden' : 'visible',
        zIndex: '1',
        '& .cms-slot': {
          overflow: 'hidden',
          height: promoBannerIsHidden ? 0 : null,
        },
        ...(isProductPassport ? initialHideStyles : {}),
      }
    },
  }),
}
