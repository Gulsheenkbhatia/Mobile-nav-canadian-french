export default {
  parts: ['freeShippingContent'],
  baseStyle: ({ theme }) => ({
    freeShippingContent: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& a': { fontFamily: 'var(--font-face1-normal)' },
      },
    },
  }),
}
