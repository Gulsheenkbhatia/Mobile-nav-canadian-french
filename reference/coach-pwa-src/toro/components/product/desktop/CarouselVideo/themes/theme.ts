export default {
  baseStyle: () => ({
    heroImgIconStyleProps: {
      alignItems: 'flex-start',
      position: 'absolute',
      bottom: '0',
      right: '0',
      gap: '6px',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      '& svg': {
        width: '40px',
        height: '40px',
      },
      '@media (min-aspect-ratio: 4/2)': {
        '& svg': {
          w: '32px',
          h: '32px',
        },
        transform: 'translate(-30%, -40%)',
      },
    },
    textPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-10)',
      lineHeight: '10.5px',
      letterSpacing: '0.176px',
      padding: '10.5px 15.8px',
      borderRadius: '702px',
      backgroundColor: 'var(--color-white-base)',
      boxShadow: '0px 7px 17.5px 0px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
    },
  }),
}
