export default {
  parts: ['overlay', 'content', 'closeButton', 'video'],
  baseStyle: {
    overlay: {
      bg: 'var(--color-black-90)',
      pt: 'var(--spacing-18)',
    },
    content: {
      bg: 'transparent',
      boxShadow: 'none',
      w: 'calc(100vw - 40px)',
      h: 'calc(100vh - 40px)',
      pt: 'var(--spacing-6)',
      pb: 'var(--spacing-6)',
      m: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 'var(--spacing-4)',
      right: '0',
      color: 'white',
      borderRadius: '50%',
      border: '1px solid white',
      width: 'var(--spacing-12)',
      height: 'var(--spacing-12)',
      zIndex: 1000,
    },
    video: {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
}
