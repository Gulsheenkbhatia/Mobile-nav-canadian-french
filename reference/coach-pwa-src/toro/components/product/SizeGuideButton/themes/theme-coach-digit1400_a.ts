export default {
  parts: ['sizeGuideButton', 'sizeGuideContainer'],
  baseStyle: ({ theme }) => ({
    sizeGuideContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        m: 0,
        fontSize: 'var(--text-12)',
      },
    }),
    sizeGuideButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        fontWeight: 400,
        border: 'none',
        textDecoration: 'underline',
      },
    },
  }),
}
