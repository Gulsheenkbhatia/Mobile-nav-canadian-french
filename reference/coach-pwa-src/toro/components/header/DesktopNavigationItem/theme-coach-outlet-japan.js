export default {
  variants: {
    tier1: () => ({
      text: (theme, isActive) => ({
        borderBottom: `var(--border-width-s) solid ${
          isActive ? 'var(--border-color-black-base)' : 'transparent'
        }`,
        '&:hover': { borderBottom: '1px solid var(--border-color-black-base)' },
        ...theme.typography['text-cta1-s'],
        color: 'var(--color-black-base)',
      }),
    }),
    tier2: () => ({
      text: () => ({
        textTransform: 'none',
      }),
    }),
    tier3: () => ({
      text: () => ({
        textTransform: 'none',
      }),
    }),
  },
}
