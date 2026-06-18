export default {
  baseStyle: ({ theme }) => ({
    collapsibleContainer: {
      backgroundColor: 'var(--color-white-base)',
      borderRadius: 'var(--spacing-2)',
      overflow: 'hidden',
      margin: 'var(--spacing-3)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    collapsibleHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: 'var(--spacing-4)',
      cursor: 'pointer',
      gap: 'var(--spacing-3)',
      userSelect: 'none',
    },
    thumbnailsContainer: {
      display: 'flex',
      position: 'relative',
      flexShrink: 0,
    },
    thumbnailImage: {
      borderRadius: '50%',
      width: 'var(--spacing-10)',
      maxHeight: 'var(--spacing-10)',
      maxWidth: 'var(--spacing-10)',
      padding: 'var(--spacing-1)',
      flexShrink: 0,
      overflow: 'hidden',
      backgroundColor: 'var(--color-page-bg)',
      border: 'var(--border-width-m) solid var(--color-border-filter-pill-default, #E1E1E1)',
      position: 'relative',
      '&:first-of-type': {
        zIndex: 3,
      },
      '&:nth-of-type(2)': {
        zIndex: 2,
      },
      '&:nth-of-type(3)': {
        zIndex: 1,
      },
      '&:not(:first-child)': {
        marginLeft: '-12px',
      },
    },
    thumbnailImageInner: {
      height: '100%',
      objectFit: 'contain',
    },
    collapsibleTitle: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      flex: 1,
    },
    chevronIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'var(--color-black-base)',
      transition: 'transform var(--transition-delay-quick) ease-in-out',
    },
    carouselWrapper: {
      paddingBottom: 'var(--spacing-4)',
    },
    carousel: {
      padding: '0 var(--spacing-4)',
      overflowX: 'auto',
      '-ms-overflow-style': 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '& > .rvImpressionSensor': {
        marginRight: 'var(--spacing-2)',
      },
      '.rvImpressionSensor': {
        display: 'flex',
        flexShrink: '0',
        flexDirection: 'column',
        position: 'relative',
      },
    },
    productTile: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      textAlign: 'center',
      wordWrap: 'break-word',
      width: '24.7vw',
      maxWidth: '180px',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4/5',
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    priceContainer: {
      marginTop: 'var(--spacing-2)',
    },
    promoContent: {
      color: 'var(--color-success-primary)',
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-12)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-s)',
      marginTop: 'var(--spacing-2)',
    },
    byvHeaderTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: '2px',
    },
    byvEyebrowText: {
      ...theme.typography['text-title1-xs'],
      fontWeight: 400,
      color: 'var(--color-neutral-medium)',
    },
  }),
}
