export default {
  baseStyle: () => ({
    swatchImage: {
      img: {
        borderRadius: '50%',
        w: '30px',
        h: '30px',
      },
      borderRadius: '50%',
    },
    swatchWrapper: {
      w: '30px',
      h: '30px',
      '&.activeColorSwatch': {
        border: '1px solid var(--color-primary)',
        p: '2px',
      },
      '&.activeColorSwatch img': {
        border: '1px solid var(--color-primary)',
        w: '24px',
        h: '24px',
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
        width: '21px',
        height: '21px',
        borderRadius: '2px',
        transform: 'translate(-50%, -50%)',
      },
      minWidth: '30px',
    },
    swatchSlider: {
      gap: 'var(--spacing-4)',
      alignItems: 'start',
      justifyContent: 'flex-start',
    },
    wrapper: {
      p: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-3)',
      '& span:not(:last-child), & a:not(:last-child)': {
        mr: '18px',
      },
      a: {
        display: 'inline-flex',
      },
    },
  }),
  variants: {
    pdpV4Enhanced: () => ({
      mainWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        mt: 'var(--spacing-1)',
        '& > .color-variants': {
          '&::before': {
            background: `none`,
          },
          '&::after': {
            background: `none`,
          },
        },
        '& > button': {
          width: '18px',
          height: '42px',

          '& > svg': {
            position: 'relative',
            right: '5px',
            transform: 'scale(0.9)',
            fill: 'black',
            stroke: 'black',
            strokeWidth: '0.5625',
          },
        },
      },
      activeColorLabel: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-10)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginBottom: '3px',
        flexBasis: '100%',
        color: 'var(--color-neutral-dark)',
      },
      swatchImage: {
        height: '42px',
        overflow: 'hidden',
        borderRadius: 'none',
        img: {
          w: '100%',
          h: '54px',
          borderRadius: 'none',
          objectFit: 'cover',
          position: 'relative',
          bottom: '2px',
        },
      },
      swatchWrapper: {
        w: '42px',
        h: '42px',
        display: 'flex',
        alignItems: 'flex-end',
        '&.activeColorSwatch': {
          border: 'none',
          borderBottom: '2px solid var(--color-primary)',
          p: 0,
        },
        '&.activeColorSwatch img': {
          border: 'none',
          w: '100%',
          h: '54px',
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
          width: '42px',
          height: '42px',
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
        m: '0px var(--spacing-4) 0px var(--spacing-4)',
        maxWidth: '216px',
        '& span:not(:last-child), & a:not(:last-child)': {
          mr: 'var(--spacing-4)',
        },
        a: {
          display: 'inline-flex',
        },
      },
    }),
  },
}
