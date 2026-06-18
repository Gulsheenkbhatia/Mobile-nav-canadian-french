export default {
  sizes: {},
  variants: {
    secondary: {
      borderColor: 'var(--color-inactive)',
    },
    'variation-option': () => ({
      '&.selected': {
        backgroundColor: 'var(--color-black-base)',
        borderColor: 'var(--color-black-base)',
      },
      '&.allow-disabled': {
        background: 'var(--color-secondary)',
        borderColor: 'var(--border-color-inactive)',
        color: 'var(--border-color-neutral-base)',
        '&:hover:not(.selected)': {
          borderColor: 'var(--border-color-neutral-base)',
          '&.allow-disabled:after': {
            background: `linear-gradient(
                            to bottom right,
                            transparent calc(50% - 1px),
                            var(--border-color-neutral-base),
                            transparent calc(50% + 1px)
                        )`,
          },
        },
      },
      '&.allow-disabled:after': {
        background: `linear-gradient(
                    to bottom right,
                    transparent calc(50% - 1px),
                    var(--border-color-inactive),
                    transparent calc(50% + 1px)
                  )`,
      },
    }),
    clearAll: ({ theme }) => ({
      ...theme.typography['text-eyebrow1-m'],
      color: 'var(--color-primary)',
    }),
  },
}
