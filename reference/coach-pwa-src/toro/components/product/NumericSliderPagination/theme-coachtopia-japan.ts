export default {
  parts: ['numbers'],
  variants: {
    pdpV42: ({ theme }) => ({
      numbers: {
        ...theme.typography['text-cta3-xs'],
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-10)',
        },
      },
    }),
  },
}
