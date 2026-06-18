export default {
  parts: ['wrapper', 'button', 'buttonText'],
  baseStyle: () => ({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      position: 'relative',
    },
    button: {
      backgroundColor: 'var(--color-white-base)',
      border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
      borderRadius: 'var(--border-radius-m)',
      padding: 'var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      height: '48px',
      textTransform: 'none',
      '& svg': {
        display: 'none',
      },
    },
    buttonText: {
      fontSize: 'var(--text-16)',
      p: 'var(--spacing-4)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-l)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontWeight: 'normal',
    },
  }),
}
