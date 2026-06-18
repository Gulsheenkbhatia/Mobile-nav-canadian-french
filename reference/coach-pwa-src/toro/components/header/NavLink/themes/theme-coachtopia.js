export default {
  variants: {
    header: ({ theme }) => ({
      ...theme.typography['text-body2-s'],
    }),
    mobileMenu: ({ theme }) => ({
      textTransform: 'uppercase',
      ...theme.typography['text-cta2-s'],
    }),
  },
}
