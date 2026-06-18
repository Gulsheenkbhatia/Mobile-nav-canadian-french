export default {
  baseStyle: ({ theme }) => ({
    mainWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      paddingTop: 'var(--spacing-2)',
      paddingBottom: 'var(--spacing-1)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      outline: 'none',
      '& *': {
        outline: 'none',
        '-webkit-tap-highlight-color': 'transparent',
      },
    },
    containerWrapper: {
      maxWidth: '100%',
      width: '100%',
      flexDirection: 'column-reverse',
      display: 'flex',
    },
    colorLabel: {
      ...theme.typography['text-title2-xs'],
      fontWeight: 500,
      color: '#000003',
      whiteSpace: 'nowrap',
      padding: '0 var(--spacing-3) var(--spacing-2)',
    },
    swatchImage: {
      height: '62px',
      overflow: 'hidden',
      img: {
        w: '100%',
        h: '62px',
        objectFit: 'cover',
        position: 'relative',
      },
    },
    swatchWrapper: {
      width: '62px',
      height: '62px',
      borderRadius: '4.6px',
      overflow: 'hidden',
      border: '1.3px solid transparent',
      '&.disabled-color::after': {
        overflow: 'hidden',
        height: '60px',
        width: '60px',
        top: '1px',
        left: '0',
      },
      '&.activeColorSwatch': {
        borderColor: '#000001',
      },
    },
    swatchSlider: {
      alignItems: 'start',
      justifyContent: 'flex-start',
      gap: '6px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    wrapper: {
      maxWidth: '100%',
      a: {
        display: 'inline-flex',
      },
      overflowX: 'auto',
      scrollbarWidth: 'none',
      px: 'var(--spacing-3)',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      gap: '6px',
      flexWrap: 'nowrap',
      width: '100%',
    },
    skeletonColorLabel: {
      height: '14px',
      width: '120px',
    },
    skeletonSwatch: {
      width: '62px',
      height: '62px',
      borderRadius: '4.6px',
      flexShrink: 0,
      border: '1.3px solid var(--color-neutral-light-2)',
    },
    skeletonWrapper: {
      gap: '6px',
      px: 'var(--spacing-3)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }),
}
