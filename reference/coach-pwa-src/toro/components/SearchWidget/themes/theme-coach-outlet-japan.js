export default {
  baseStyle: ({ theme }) => ({
    input: {
      ...theme.typography['text-body2-s'],
      '&::placeholder': {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-black-base)',
        opacity: '0.5',
      },
    },
  }),
}
