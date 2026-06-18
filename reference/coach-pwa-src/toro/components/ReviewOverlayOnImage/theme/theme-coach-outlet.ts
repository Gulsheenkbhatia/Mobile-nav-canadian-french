export default {
  variants: {
    reviewOverlayOnImageUpper: ({ theme }) => ({
      reviewOverlayTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-badge1-xs'],
          fontSize: 'var(--text-10)',
          lineHeight: 'var(--line-height-115)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-black-base)',
          textTransform: 'uppercase',
        },
      },
    }),
  },
}
