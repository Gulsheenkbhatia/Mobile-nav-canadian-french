export default {
  baseStyle: ({ theme }) => ({
    drawerContent: {
      position: 'relative',
      width: '100%',
      padding: 'var(--spacing-6)',
      borderRadius: 'var(--spacing-4) var(--spacing-4) 0 0',
      '& .chakra-modal__close-btn': {
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
        position: 'absolute',
        top: 'var(--spacing-6)',
        right: 'var(--spacing-6)',
      },
      '& h2': {
        ...theme.typography['text-display4-xxs'],
        fontWeight: 700,
        color: 'var(--color-primary)',
        textTransform: 'capitalize',
      },
      '& p': {
        ...theme.typography['text-body1-l'],
        paddingTop: 'var(--spacing-2)',
        color: 'var(--color-neutral-medium, #575757)',
      },
      '& a': {
        textDecoration: 'underline',
      },
    },
  }),
}
