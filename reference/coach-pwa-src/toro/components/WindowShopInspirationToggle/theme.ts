export default {
  baseStyle: () => ({
    switchWrapper: {
      display: 'inline-flex',
      backgroundColor: 'var(--color-neutral-light)',
      border: `1px solid var(--color-neutral-light-2)`,
      borderRadius: 'var(--border-radius-full)',
      padding: 'var(--spacing-2)',
      height: '40px',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 'var(--text-12)',
      fontFamily: 'var(--font-face1-extended-bold)',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textTransform: 'none',
      margin: 'auto',
      pl: '3px',
      pr: 'var(--spacing-2)',
      pt: '2px',
    },
    trackSwitch: {
      '& .chakra-switch__track': {
        width: '40px',
      },
      '& .chakra-switch__thumb[data-checked]': {
        transform: 'translateX(24px)',
      },
    },
    tooltip: {
      bottom: '-20px',
      right: '-16px',
      animation: '2s appearance forwards',
      visibility: 'hidden',
      '@keyframes appearance ': {
        '99%': {
          visibility: 'hidden',
        },
        '100%': {
          visibility: 'visible',
        },
      },
    },
  }),
}
