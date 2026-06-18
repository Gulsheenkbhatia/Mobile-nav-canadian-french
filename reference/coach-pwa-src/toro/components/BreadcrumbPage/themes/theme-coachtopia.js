export default {
  baseStyle: ({ theme }) => ({
    separator: {
      '& *': {
        ...theme.typography['text-body2-s'],
      },
    },
  }),
}
