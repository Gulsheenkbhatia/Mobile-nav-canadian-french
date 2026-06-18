export default {
  variants: {
    tier1: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--border-color-black-base)' : 'transparent'
        }`,
        '&:hover': { borderBottom: '1px solid var(--border-color-black-base)' },
        ...theme.typography['text-body1-s'],
        color: 'var(--color-primary)',
        textTransform: 'uppercase',
      }),
    }),
    tier2: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--border-color-black-base)' : 'transparent'
        }`,
        ...theme.typography['text-body2-l'],
        textTransform: 'none',
        color: 'var(--color-black-base)',
      }),
    }),

    tier3: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--color-black-base)' : 'transparent'
        }`,
        ...theme.typography['text-body2-m'],
        textTransform: 'none',
        color: 'var(--color-black-base)',
      }),
    }),
  },
}
