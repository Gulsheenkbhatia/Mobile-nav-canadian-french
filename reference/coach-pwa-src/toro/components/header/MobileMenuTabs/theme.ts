export default {
  parts: ['container', 'buttonProps', 'logoPropsRetail', 'logoPropsOutlet', 'closeButton', 'tabs'],
  baseStyle: () => ({
    container: {
      width: '100%',
      backgroundColor: 'var(--color-standout-primary, #333)',
      height: '49px',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingLeft: 'var(--spacing-3)',
      paddingRight: 'var(--spacing-3)',
    },
    tabs: {
      borderColor: 'transparent',
      justifyContent: 'flex-start',
      '& button': {
        transition: 'background-color 100ms ease-out',
      },
    },
    buttonProps: {
      height: '40px',
      padding: 'var(--spacing-4)',
      marginTop: 0,
      color: 'black',
      marginRight: 'var(--spacing-2)',
      border: 'none',
      borderRadius: '6px 6px 0 0',
      position: 'relative',
      backgroundColor: 'var(--color-standout-primary, #333)',
      '&.active': {
        border: 'none',
        'svg, svg path': {
          fill: 'var(--color-black-base)',
        },
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      '&.active:before': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 0,
        left: '-20px',
        height: '10px',
        width: '20px',
        borderBottomRightRadius: '6px',
        boxShadow: '8px 0.3px 0 var(--color-neutral-light-1)',
      },
      '&.active::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 0,
        right: '-20px',
        height: '10px',
        width: '20px',
        borderBottomLeftRadius: '6px',
        boxShadow: '-8px 0.3px 0 var(--color-neutral-light-1)',
      },
      '&:focus': {
        boxShadow: 'none',
      },
      '&:active': {
        background: 'white',
      },
      'svg, path': {
        fill: 'var(--color-white-base)',
        transition: 'fill 100ms ease-out',
      },
    },
    logoPropsRetail: {
      height: '8px',
      width: '74px',
      viewBox: '0 0 252 28',
    },
    logoPropsOutlet: {
      height: '8px',
      width: '124px',
    },
    closeButton: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignSelf: 'center',
      '&:focus': {
        boxShadow: 'none',
      },
      '& svg path': {
        stroke: 'var(--color-white-base) !important',
      },
    },
  }),
}
