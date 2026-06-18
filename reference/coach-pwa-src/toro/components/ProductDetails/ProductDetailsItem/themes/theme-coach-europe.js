export default {
  parts: ['productPropertiesWrapper'],
  baseStyle: () => ({}),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      productPropertiesWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '#description2': {
            '& h2': {
              ...theme.typography['text-body1-s'],
              fontWeight: 700,
              lineHeight: 'var(--line-height-120)',
            },
            '& li': {
              color: 'var(--color-black-base)',
            },
          },
        },
      }),
    }),
  },
}
