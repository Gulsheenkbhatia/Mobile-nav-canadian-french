const buttonBorderBase = {
  width: '120px',
  borderRadius: '15px',
  borderColor: 'var(--color-neutral-light-2)',
}

export default {
  baseStyle: ({ theme }) => ({
    container: {
      position: 'absolute',
      top: 'calc(100% - 1px)',
      display: 'flex',
      flexDirection: 'column',
      width: '294px',
      right: 0,
      backgroundColor: 'transparent',
      zIndex: 2,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--color-white-base)',
      padding: 'var(--spacing-1) 20px var(--spacing-3) var(--spacing-4)',
      cursor: 'pointer',
      mb: 'var(--spacing-1)',
      borderRadius: 0,
      borderBottomLeftRadius: 'var(--spacing-4)',
    },
    thumbnailsContainer: {
      display: 'flex',
      mr: '10px',
      height: '40px',
    },
    thumbnailImage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      padding: '7px 7px 9px 7px',
      overflow: 'hidden',
      backgroundColor: 'var(--color-neutral-light-1)',
      border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
      '&:first-of-type': { zIndex: 3 },
      '&:nth-of-type(2)': { zIndex: 2, marginLeft: '-12px' },
      '&:nth-of-type(3)': { zIndex: 1, marginLeft: '-12px' },
    },
    thumbnailImageInner: {
      width: '26px',
      height: '24px',
      objectFit: 'cover',
      display: 'block',
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    title: {
      ...theme.typography['text-title2-s'],
    },
    chevronIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'var(--color-black-base)',
      transition: 'transform var(--transition-delay-quick) ease-in-out',
    },
    bodyWrapper: {
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      backgroundColor: 'var(--color-neutral-light-1)',
      padding: 'var(--spacing-2) 0 var(--spacing-4) var(--spacing-3)',
      borderTopLeftRadius: 'var(--spacing-4)',
      borderBottomLeftRadius: 'var(--spacing-6)',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-neutral-base) var(--color-neutral-light-1)',
      scrollbarGutter: 'stable',
      '&::-webkit-scrollbar': {
        width: '4px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--color-neutral-base)',
        borderRadius: '12px',
      },
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gap: 'var(--spacing-2)',
      rowGap: 'var(--spacing-4)',
    },
    productTile: {
      display: 'flex',
      height: '100%',
      justifyContent: 'space-between',
      flexDirection: 'column',
      textAlign: 'center',
      wordWrap: 'break-word',
      minWidth: 0,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '4/5',
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    atbButton: {
      wrapper: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        mt: '6px',
        width: '100%',
      },
      button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '36px',
        padding: '0 var(--spacing-6)',
        borderRadius: '130px',
        backgroundColor: 'var(--color-white-base)',
        border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
        '&:hover:not(:disabled), &:active ': {
          backgroundColor: 'var(--color-white-base)',
        },
      },
      buttonText: {
        ...theme.typography['text-title1-s'],
        textTransform: 'none',
        fontWeight: 400,
        mt: '2px',
      },
      buttonBorderBottom: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: 'transparent',
        borderTopRadius: '15px',
      },
      buttonBorderTop: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderColor: 'transparent',
        borderBottomRadius: '15px',
      },
      sizeDrawerContainer: {
        width: '120px',
        border: 'none',
        boxShadow: 'none',
        background: 'none',
        _focus: { boxShadow: 'none' },
        '& .drawer-size-text': {
          ...theme.typography['text-title1-s'],
        },
      },
      sizeDrawerBox: {
        width: '100%',
        height: 'auto',
        borderRadius: '15px',
        padding: '0 var(--spacing-1) var(--spacing-1) var(--spacing-3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
      },
      sizeDrawerBoxOpenDown: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingTop: 0,
        paddingBottom: 'var(--spacing-1)',
      },
      sizeDrawerBoxOpenUp: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingTop: 'var(--spacing-3)',
        paddingBottom: 0,
        borderBottom: 'none',
        '.controls-btn-child:last-child': {
          mb: 0,
        },
        '.controls-btn-child:nth-last-child(2)': {
          mb: 0,
        },
      },
      sizeDrawerLabel: {
        display: 'none',
      },
    },
  }),
  variants: {
    plp: ({ theme }) => ({
      bodyWrapper: {
        backgroundColor: 'var(--color-secondary)',
        scrollbarColor: 'var(--color-neutral-base) var(--color-secondary)',
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'var(--color-secondary)',
        },
      },
      atbButton: {
        wrapper: {
          mt: '6px',
        },
        button: {
          width: '110px',
          height: '29px',
          padding: 'var(--spacing-2) var(--spacing-6)',
          border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
        },
        buttonBorderBottom: {
          ...buttonBorderBase,
          borderBottomColor: 'transparent',
        },
        buttonBorderTop: {
          ...buttonBorderBase,
          borderTopColor: 'transparent',
        },
        buttonText: {
          ...theme.typography['text-cta2-xxs'],
          mt: '3px',
        },
        sizeDrawerBox: {
          width: '120px',
          border: '1px solid var(--color-neutral-light-2)',
        },
        sizeDrawerBoxOpenDown: {
          borderTop: 'none',
        },
      },
    }),
  },
}
