export default {
  variants: {
    tier1: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--border-color-black-base)' : 'transparent'
        }`,
        textTransform: 'uppercase',
        '&:hover': { borderBottom: '1px solid var(--border-color-black-base)' },
        ...theme.typography['text-cta1-s'],
        color: 'var(--color-primary)',
      }),
    }),

    tier2: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--border-color-black-base)' : 'transparent'
        }`,
        ...theme.typography['text-body2-l'],
        textTransform: 'capitalize',
        color: 'var(--color-black-base)',
      }),
    }),

    tier3: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--color-black-base)' : 'transparent'
        }`,
        ...theme.typography['text-body2-m'],
        textTransform: 'capitalize',
        color: 'var(--color-black-base)',
      }),
    }),
  },
}
