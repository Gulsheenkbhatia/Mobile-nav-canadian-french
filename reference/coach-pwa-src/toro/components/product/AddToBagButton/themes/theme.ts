export default {
  parts: ['addToBagButton', 'addToBagAnimation', 'addToBagWrapper', 'initialAddToBagWrapper'],
  baseStyle: ({ theme }) => ({
    addToBagButton: ({ buttonProps }) => ({
      padding: 'var(--spacing-4)',
      '&:focus': {
        boxShadow: theme.focus.boxShadow,
        outline: theme.focus.outline,
      },
      '&[disabled]:hover': {
        background: buttonProps?.disabled
          ? theme.colors.main.inactive
          : 'var(--color-neutral-base)',
      },
      textTransform: buttonProps?.disabled ? 'none' : 'uppercase',
    }),
    initialAddToBagWrapper: {
      size: 'lg',
      w: '100%',
      h: '100%',
      whiteSpace: 'break-spaces',
      pointerEvents: 'none',
    },
  }),
  variants: {
    tabbedPDP: ({ theme }) => ({
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta1-s'],
          fontSize: 'var(--text-12)',
          h: '48px',
          p: 'var(--spacing-3)',
          '&:disabled': {
            color: 'var(--color-white-base)',
            backgroundColor: 'var(--color-black-base)',
          },
        },
      }),
      addToBagAnimation: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          h: '48px',
          borderRadius: 'var(--border-radius-xs)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: 0,
          height: '56px',
        },
      },
      addToBagAnimation: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          borderRadius: 0,
          height: '56px',
        },
      },
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-black-base)',
          },
          border: 'none',
          borderRadius: 0,
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          fontWeight: '400',
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-black-base)',
          padding: 'var(--spacing-3)',
          height: '56px',
          textTransform: 'none',
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: 1,
          paddingTop: 'var(--spacing-4)',
          '&[disabled]': {
            opacity: 1,
            backgroundColor: 'var(--color-neutral-light-2)',
            color: 'var(--color-neutral-base)',
          },
        },
      }),
      initialAddToBagWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textTransform: 'none',
        },
      },
    }),
  },
}
