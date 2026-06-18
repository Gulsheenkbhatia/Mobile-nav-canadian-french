export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      ...theme.typography['text-title1-s'],
      color: 'var(--color-primary)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterpacing: 'var(--Letter-Spacing-spacing-xs)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-125)',
        letterpacing: 'var(--Letter-Spacing-spacing-xs)',
      },
      '&:has(.findInStoreProductInfoMessage)': {
        width: '100%',
        padding: 'var(--spacing-4) var(--spacing-3) var(--spacing-6)',
        '& .findInStoreProductInfoMessage': {
          background: 'white',
          borderRadius: '4px',
          padding: 'var(--spacing-4) 18px',
        },
      },
    },
    alertIconContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'center',
        mb: '2px',
        '& svg': {
          width: 'var(--spacing-3)',
          height: 'var(--spacing-3)',
        },
      },
    },
    infoMessageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
        p: 0,
        background: 'var(--color-neutral-light-1)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
  }),
}
