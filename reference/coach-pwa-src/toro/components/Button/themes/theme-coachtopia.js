export default {
  variants: {
    secondary: {
      borderColor: 'var(--color-inactive)',
    },
    clearAll: ({ theme }) => ({
      ...theme.typography['text-cta1-xs'],
      color: 'var(--color-primary)',
      borderColor: theme.colors.main.gray,
      '&:hover:not(:disabled), &:active': {
        backgroundColor: theme.colors.main.secondary,
        color: theme.colors.main.primary,
        borderColor: theme.colors.main.primary,
      },
    }),
    outline: ({ theme }) => ({
      '& .chakra-text': {
        ...theme.typography['text-cta1-xs'],
        color: 'var(--color-primary)',
      },
      'variation-option': () => ({
        ...theme?.typography['text-body2-m'],
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
    }),
  },
}
