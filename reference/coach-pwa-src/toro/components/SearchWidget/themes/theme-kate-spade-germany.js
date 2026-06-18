export default {
  variants: {
    footer: ({ theme }) => ({
      input: {
        '&::placeholder': {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
        },
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
      },
    }),
  },
}
