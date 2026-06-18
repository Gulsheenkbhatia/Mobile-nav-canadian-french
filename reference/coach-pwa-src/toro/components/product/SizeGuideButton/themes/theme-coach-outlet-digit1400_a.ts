export default {
  parts: ['sizeGuideButton', 'sizeGuideContainer'],
  baseStyle: ({ theme }) => ({
    sizeGuideContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        m: '6px 0 0',
      },
    }),
    sizeGuideButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        fontWeight: 400,
        border: 'none',
        textDecoration: 'underline',
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
  }),
  variants: {
    tabbedPDP: ({ theme }) => ({
      sizeGuideContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: '0',
        },
      }),
    }),
  },
}
