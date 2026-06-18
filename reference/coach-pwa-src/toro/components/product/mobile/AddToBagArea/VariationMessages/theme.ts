export default {
  baseStyle: ({ theme }) => ({
    variationAlertMessage: {
      ...theme.typography['text-title1-s'],
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterpacing: 'var(--Letter-Spacing-spacing-xs)',
    },
    infoMessage: {
      ...theme.typography['text-title1-s'],
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterpacing: 'var(--Letter-Spacing-spacing-xs)',
    },
    ErrorMessageContainer: () => ({
      p: '18px var(--spacing-3) var(--spacing-4)',
      background: 'var(--color-neutral-light-1)',
      borderRadius: 'var(--border-radius-s)',
      '&:empty': {
        display: 'none',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .product-info-message': {
          mt: '0',
        },
      },
    }),
  }),
}
