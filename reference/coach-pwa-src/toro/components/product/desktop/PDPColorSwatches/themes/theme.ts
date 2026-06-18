export default {
  baseStyle: ({ theme }) => ({
    mainWrapper: {
      display: 'flex',
      alignItems: 'center',
      mt: '2px',
      width: '100%',
      position: 'relative',
      justifyContent: 'start',
      '& > button': {
        position: 'absolute',
        width: '18px',
        height: '42px',
        zIndex: 2,
        '& > svg': {
          position: 'relative',
          right: '5px',
          transform: 'scale(0.9)',
          fill: 'black',
          stroke: 'black',
          strokeWidth: '0.5625',
        },
        '&.left-arrow': {
          top: '22%',
          left: '-2%',
        },
        '&.right-arrow': {
          top: '22%',
          right: '-2%',
        },
      },
      '&:has( .left-arrow[disabled])': {
        '& .left-arrow': {
          visibility: 'hidden',
        },
        '& .color-variants:before': {
          content: 'unset',
        },
      },
      '&:has( .right-arrow[disabled])': {
        '& .right-arrow': {
          visibility: 'hidden',
        },
        '& .color-variants:after': {
          content: 'unset',
        },
      },
    },
    containerWrapper: {
      maxWidth: '40%',
      minWidth: 0,
      flexGrow: 1,
    },
    colorLabel: {
      ...theme.typography['text-cta2-xxs'],
      color: 'var(--color-neutral-1)',
      whiteSpace: 'nowrap',
    },
    swatchImage: {
      height: '60px',
      overflow: 'hidden',
      borderRadius: 'none',
      img: {
        w: '100%',
        h: '60px',
        borderRadius: 'none',
        objectFit: 'cover',
        position: 'relative',
        bottom: '2px',
      },
    },
    swatchWrapper: {
      w: '48px',
      h: '60px',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden',
      '&.activeColorSwatch': {
        border: 'none',
        borderBottom: '2px solid var(--color-primary)',
        p: 0,
      },
      '&.activeColorSwatch img': {
        border: 'none',
        w: '100%',
        h: '60px',
      },
      '&.activeColorSwatch img:focus-visible': {
        outline: '0px solid transparent',
      },
      '&.disabled-color::after': {
        zIndex: '1',
        content: '""',
        cursor: 'pointer',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '48px',
        height: '60px',
        borderRadius: '2px',
        transform: 'translate(-50%, -50%)',
      },
      borderRadius: null,
      minWidth: '100%',
    },
    swatchSlider: {
      gap: 'var(--spacing-4)',
      alignItems: 'start',
      justifyContent: 'flex-start',
    },
    wrapper: {
      p: 0,
      m: 0,
      maxWidth: '100%',
      a: {
        display: 'inline-flex',
      },
      gap: 'var(--spacing-2)',
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
    },
  }),
  variants: {
    pdpv5Zoom: ({ scrollable }) => ({
      colorLabel: {
        mt: 'var(--spacing-4)',
        textAlign: 'center',
      },
      mainWrapper: {
        justifyContent: !scrollable ? 'center' : 'start',
      },
    }),
  },
}
