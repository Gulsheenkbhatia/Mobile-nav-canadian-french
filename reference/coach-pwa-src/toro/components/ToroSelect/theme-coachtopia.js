export default {
  baseStyle: () => ({
    select: {
      minWidth: '70px',
      borderColor: 'var(--border-color-neutral-base)',
    },
  }),
  variants: {
    adaptiveTabbedPDP: () => ({
      select: {
        paddingTop: '10px',
        fontFamily: 'var(--font-face1-extrabold)',
        fontSize: 'var(--text-16)',
        lineHeight: 1,
        fontWeight: 800,
      },
    }),
  },
}
