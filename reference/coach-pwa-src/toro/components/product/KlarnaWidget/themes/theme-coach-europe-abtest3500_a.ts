export default {
  parts: ['container'],
  baseStyle: ({ theme }) => ({
    container: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexWrap: 'nowrap',
      },
    },
  }),
}
