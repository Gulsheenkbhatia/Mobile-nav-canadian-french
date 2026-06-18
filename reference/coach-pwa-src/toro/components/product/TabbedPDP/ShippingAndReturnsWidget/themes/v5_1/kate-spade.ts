export default {
  parts: ['shippingAndReturnLabel'],
  baseStyle: ({ theme }) => ({
    shippingAndReturnLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '42px',
      gap: '2px',
      ...theme.typography['text-body2-xs'],
      fontWeight: '500',
      color: 'var(--color-white-base, #fff)',
      '& path': {
        fill: 'var(--color-white-base, #fff)',
      },
      '& svg': {
        marginLeft: 'var(--spacing-0, 0) !important',
        cursor: 'pointer',
      },
    },
  }),
}
