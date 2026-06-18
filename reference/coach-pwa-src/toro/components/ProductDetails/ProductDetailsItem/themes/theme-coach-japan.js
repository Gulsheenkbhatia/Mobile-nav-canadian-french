export default {
  parts: ['editorDescriptions', 'productPropertiesWrapper'],
  baseStyle: ({ theme }) => ({
    accordion_details: {
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-2xl)',
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
  variants: {
    adaptiveTabbedPDP: () => ({
      editorDescriptions: {
        fontSize: 'var(--text-16)',
        fontFamily: 'var(--font-face2-normal)',
      },
      productPropertiesWrapper: () => ({
        '#description2': {
          '& li': {
            fontSize: 'var(--text-16)',
            fontFamily: 'var(--font-face2-normal)',
            marginLeft: 'var(--spacing-3)',
          },
        },
      }),
    }),
  },
}
