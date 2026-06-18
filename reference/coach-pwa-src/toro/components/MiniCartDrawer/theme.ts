const DESKTOP_WIDTH = '495px'
const MAX_HEIGHT = '65vh'

export default {
  baseStyle: ({ theme }) => ({
    drawerContent: {
      width: `${DESKTOP_WIDTH} !important`,
      position: 'fixed',
      bottom: '0px',
      top: 'auto !important',
      maxHeight: MAX_HEIGHT,
      backgroundColor: 'white',
      zIndex: 1800,
    },
    drawerOverlay: {
      width: `${DESKTOP_WIDTH} !important`,
      right: '0px',
      left: 'auto',
      opacity: '1',
      backgroundColor: 'rgba(0,0,0,0.32)',
      zIndex: 1700,
    },
  }),
}
