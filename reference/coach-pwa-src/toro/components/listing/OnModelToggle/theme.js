export default {
  baseStyle: () => ({
    onModelToggle: {
      display: 'inline-flex',
      alignItems: 'center',
      marginRight: 'var(--spacing-3)',
      justifyContent: 'flex-end',
      width: '100%',
      gap: 'var(--spacing-2)',
    },
    onModelToggleWithFilters: {
      display: 'inline-flex',
      alignItems: 'center',
      margin: 'var(--spacing-4)',
      marginBottom: '0',
      gap: 'var(--spacing-2)',
    },
    separator: {
      width: '1px',
      height: '14px',
      backgroundColor: 'var(--color-black-base)',
      marginX: 'var(--spacing-2)',
    },
    separator2Up: {
      height: '10px',
    },
    viewTitle: {
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      fontWeight: 'normal',
      lineHeight: 'var(--line-height-120)',
      letterSpacing: 'var(--letter-spacing-s)',
      color: 'var(--color-black-base)',
      marginTop: 'var(--spacing-1)',
    },
    switch: {
      '& .chakra-switch__track': {
        width: '32px',
        height: '16px',
        padding: 'var(--spacing-1)',
      },
      '& .chakra-switch__track[data-checked]': {
        backgroundColor: 'var(--color-success-primary)',
      },
      '& .chakra-switch__thumb[data-checked]': {
        transform: 'translateX(16px)',
      },
    },
  }),
}
