export default {
  baseStyle: {
    modalContentRoot: {
      width: '100%',
      maxWidth: { base: '400px', md: '600px' },
      borderRadius: 0,
      padding: 'var(--spacing-6)',
    },
    closeButton: {
      top: 'var(--spacing-6)',
      right: 'var(--spacing-6)',
      '& svg': {
        width: '16px',
        height: '16px',
      },
    },
  },
}
