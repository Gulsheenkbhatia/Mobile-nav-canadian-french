export default {
  parts: ['priceInputBox'],
  baseStyle: ({ theme }) => ({
    FilterByText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    filterText: {
      minWidth: '25px',
      textAlign: 'center',
    },
  }),
  variants: {
    plpV3: () => ({
      priceInputBox: () => ({
        paddingLeft: 'var(--spacing-6)',
        color: 'var(--color-black-base)',
      }),
    }),
    desktopFilterV3: ({ theme }) => ({
      priceInputBox: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          color: 'var(--color-black-base)',
          borderColor: '#000003',
          borderRadius: '3px',
          padding: '10px var(--spacing-4) var(--spacing-3) var(--spacing-8)',
          height: '44px',
          width: '118px',
        },
      }),
    }),
  },
}
