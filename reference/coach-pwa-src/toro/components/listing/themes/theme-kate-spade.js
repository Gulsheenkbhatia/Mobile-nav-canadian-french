export default {
  baseStyle: ({ theme }) => ({
    totalProductsCount: {
      ...theme.typography['text-body1-m'],
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      categoryHeader: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-neutral-light-1, #f0f0f0)',
        },
      },
      totalProductsCount: {
        color: 'var(--color-neutral-medium)',
        ...theme.typography['text-body1-s'],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-m'],
          fontWeight: '400',
          color: 'var(--color-neutral-medium, #575757)',
          alignSelf: 'end',
          marginBottom: '3px',
          '&.plp-v3-1': {
            lineHeight: 'var(--line-height-125)',
            letterSpacing: 'var(--letter-spacing-xs)',
          },
        },
      },
    }),
    srpV3: ({ theme }) => ({
      totalProductsCount: {
        color: 'var(--color-neutral-medium)',
        mr: 'var(--spacing-3)',
        paddingTop: '3px',
        ...theme.typography['text-body1-s'],
      },
    }),
  },
}
