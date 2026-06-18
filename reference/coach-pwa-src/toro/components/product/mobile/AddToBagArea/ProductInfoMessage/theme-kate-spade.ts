export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      ...theme.typography['text-body2-m'],
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
        alignSelf: 'flex-start',
        marginTop: '3px',
        '& svg': {
          marginRight: 'var(--spacing-2)',
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
