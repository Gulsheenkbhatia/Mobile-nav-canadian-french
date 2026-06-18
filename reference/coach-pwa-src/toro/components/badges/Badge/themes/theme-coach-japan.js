export default {
  variants: {
    marketingContentPdp: ({ theme }) => ({
      pr: 0,
      mr: 'var(--spacing-2)',
      '& label': {
        borderRadius: 'var(--border-radius-xs)',
        bg: theme.colors.main.inactive,
        padding: 'var(--spacing-1) var(--spacing-2)',
        lineHeight: 'var(--line-height-175)',
        '& a': {
          fontWeight: '500',
        },
      },
    }),
    inventoryStatus: ({ theme }) => ({
      mb: 'var(--spacing-3)',
      ...theme.typography['text-body1-s'],
      color: '(var--color-neutral-dark)',
      fontWeight: 500,
    }),
    onImagePLP: ({ theme }) => ({
      '& label': {
        ...theme.typography['text-body1-s'],
      },
    }),
    lowInventoryAboveATB: () => ({
      textAlign: 'center',
      color: 'var(--color-sale)',
    }),
  },
}
