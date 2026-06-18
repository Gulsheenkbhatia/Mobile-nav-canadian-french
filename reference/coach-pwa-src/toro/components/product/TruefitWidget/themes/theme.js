export default {
  baseStyle: () => ({
    TrueFitContainer: {
      mt: '30px',
      mb: '30px',
      minHeight: 12,
    },
    TrueFitButton: (showButtonAsAlink) => ({
      padding: showButtonAsAlink ? '0px' : 'var(--spacing-4)',
    }),
    trueFitModalWrapper: {
      '@media (min-width: 769px)': {
        right: '75px',
        mt: '50px',
        w: '375px',
        h: '90vh',
        minHeight: '540px',
        maxHeight: '765px',
        borderRadius: '15px',
      },
      '@media not all and (min-width: 769px)': {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        mt: '0',
      },
      position: 'fixed',
      overflowY: 'auto',
      top: 0,
      right: 0,
      height: '100%',
      width: '100%',
      zIndex: 2147483647,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    trueFitSkeleton: {
      bg: 'var(--neutrals-color-neutral-light)',
      mt: 'var(--spacing-4)',
      mb: 'var(--spacing-6)',
      padding: 'var(--spacing-4)',
    },
  }),
}
