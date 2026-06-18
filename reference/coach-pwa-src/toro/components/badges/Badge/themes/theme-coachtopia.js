export default {
  size: {},
  variants: {
    onImagePLP: ({ theme }) => ({
      '& *': {
        ...theme.typography['text-body1-s'],
        color: theme.colors.main.primary,
      },
    }),
    upperPlacementPLP: ({ theme }) => ({
      '& *': {
        ...theme.typography['text-eyebrow1-m'],
        color: theme.colors.main.black,
      },
    }),
    onImagePDP: ({ theme }) => ({
      '&.custom-badge-content': {
        margin: { base: 'var(--spacing-1) var(--spacing-3)', lg: '0' },
        backgroundColor: { base: 'var(--color-white-base)', lg: 'inherit' },
        paddingLeft: { base: 'var(--spacing-1)', lg: '0' },
        '& a': {
          ...theme.typography['text-badge1-xs'],
        },
        '& p': {
          ...theme.typography['text-badge1-xs'],
        },
      },
      '& label': {
        margin: { base: '0', lg: 'var(--spacing-2)' },
      },
    }),
    marketingContentPdp: ({ theme }) => ({
      '@media (max-width: 769px)': {
        '&.custom-badge>div': {
          ...theme.typography['text-body2-s'],
          color: 'red',
        },
        '&.custom-badge-content': {
          ...theme.typography['text-body2-s'],
          paddingInlineStart: 0,
          marginBottom: 0,
          '& > p': {
            ...theme.typography['text-body2-s'],
            textTransform: 'capitalize',
          },
        },
      },
      '@media (min-width: 769px)': {
        '&.custom-badge-content > p': {
          ...theme.typography['text-body2-s'],
        },
      },
    }),
  },
}
