export default {
  variants: {
    plpV3: ({ theme }) => ({
      button: {
        border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
        ':disabled': {
          border: 'var(--border-width-s) solid var(--color-neutral-light-3)',
        },
        '& > p': {
          ...theme.typography['text-body1-s'],
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
          },
          color: 'var(--color-black-base)',
        },
        ':disabled > p': {
          color: 'var(--color-black-base)',
        },
      },
    }),

    plpV3OnImage: ({ theme }) => ({
      wrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          position: 'static',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'auto',
          width: '100%',
        },
      },
      button: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 14px 10px var(--spacing-3)',
          height: '40px',
          minHeight: '40px',
          width: '100%',
          textTransform: 'none',
          gap: '6px',
          borderRadius: '3px',

          '& > p': {
            ...theme.typography['text-body1-l'],
            fontWeight: 400,
            paddingTop: '2px',
          },

          '&:disabled': {
            backgroundColor: 'var(--color-neutral-light-2) !important',
            opacity: 1,

            '& > p': {
              color: 'var(--color-neutral-medium)',
            },
          },
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-primary)',
            opacity: 1,

            '& > p': {
              color: 'var(--color-secondary)',
            },

            '& svg': {
              fill: 'var(--color-secondary)',
            },
          },
        },
      },
      icon: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '24px',
          height: '24px',
        },
      },
    }),
  },
}
