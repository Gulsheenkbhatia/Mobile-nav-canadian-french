export default {
  parts: ['sizeVariationButton'],
  baseStyle: ({ theme }) => ({
    sizeVariationButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-black-base)',
        backgroundColor: 'var(--color-white-base)',
        padding: '18px 20px',
        borderRadius: 'var(--border-radius-s)',
        borderColor: '#e6e6e6',
        textTransform: 'capitalize',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
        height: '47px',
      },
    },
  }),
}
