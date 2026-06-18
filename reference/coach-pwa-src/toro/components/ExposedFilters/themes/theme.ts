export default {
  baseStyle: ({ theme }) => ({
    buttonsContainer: {
      gap: 'var(--spacing-1)',
    },
    FilterButtons: {
      display: 'inline-flex',
      padding: '10px 14px',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '58px',
      color: 'var(--color-black-base)',
      border: 'var(--border-width-s) solid var(--color-neutral-light-2)',
      background: 'var(--color-white-base)',
      textTransform: 'none',
      minWidth: 'auto',
      maxHeight: '36px',
      '&:first-child': {
        marginLeft: 'var(--spacing-2)',
      },
      '&:last-child': {
        marginRight: 'var(--spacing-3)',
      },
      fontSize: 'var(--text-10)',
      whiteSpace: 'nowrap',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: theme.letterSpacings.xs,
      fontFamily: 'var(--font-face1-extended-normal)',
      '&.selected': {
        border: 'var(--border-width-s) solid var(--color-black-base) !important',
      },
      '&:hover': {
        border: 'unset',
      },
    },
  }),
}
