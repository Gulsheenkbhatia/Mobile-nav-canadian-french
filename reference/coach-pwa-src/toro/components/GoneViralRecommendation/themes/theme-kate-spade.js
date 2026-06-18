export default {
  baseStyle: ({ theme }) => ({
    goneViralWrapper: {
      bg: 'var(--color-neutral-light-1)',
    },
    goneViralContainer: {
      bg: 'var(--color-white-base)',
    },
    subtitle: {
      ...theme.typography['text-body1-m'],
    },
    title: {
      ...theme.typography['text-display1-m'],
    },
  }),
}
