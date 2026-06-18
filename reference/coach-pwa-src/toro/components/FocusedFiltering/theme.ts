export default {
  baseStyle: () => ({
    mobileFilterButton: {
      mx: '6px',
      height: '36px',
      '& span.chakra-checkbox__control': {
        display: 'none',
      },
      '& span.chakra-checkbox__label': {
        m: 0,
      },
      '&[data-checked]': {
        backgroundColor: 'var(--color-secondary)',
        border: '1px solid var(--color-primary)',
        height: '36px',
      },
    },
    skeleton: {
      borderRadius: 'var(--border-radius-full)',
      height: '36px',
      width: '100px',
    },
    skeletonContainer: {
      gap: 'var(--spacing-3)',
      marginLeft: '14px',
    },
  }),
}
