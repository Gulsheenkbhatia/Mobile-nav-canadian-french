export default {
  parts: [],
  baseStyle: ({ theme }) => ({
    accordion_details: {
      ...theme.typography['text-body1-m'],
    },
    productPropertiesText: {
      ...theme.typography['text-body1-m'],
    },
    productPropertiesWrapper: () => ({
      px: 0,
      py: 'var(--spacing-2)',
      '#description2': {
        '& li': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            marginLeft: 'var(--spacing-3)',
          },
          marginLeft: 'var(--spacing-4)',
        },
      },
    }),
  }),
}
